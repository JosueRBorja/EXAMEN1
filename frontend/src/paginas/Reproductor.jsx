import { Eye, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  crearComentario,
  obtenerComentarios,
  obtenerRecomendados,
  obtenerVideo,
  registrarVista,
} from "../servicios/api";
import Avatar from "../componentes/atomos/Avatar";
import TarjetaVideo from "../componentes/moleculas/TarjetaVideo";
import { EsqueletoReproductor } from "../componentes/organismos/EsqueletosCarga";
import { mostrarFechaCompleta } from "../utilidades/fechas";
import { mostrarVistas } from "../utilidades/vistas";

export default function Reproductor({ idVideo, usuario, alAbrirVideo }) {
  const [video, setVideo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorComentario, setErrorComentario] = useState("");
  const [error, setError] = useState("");
  const [reproduccionContinua, setReproduccionContinua] = useState(
    () => localStorage.getItem("reproduccion-continua") !== "false",
  );
  const videoElemento = useRef(null);
  const reproducirAlCargar = useRef(false);

  useEffect(() => {
    if (!idVideo) return;

    setVideo(null);
    setError("");
    Promise.all([
      obtenerVideo(idVideo),
      obtenerComentarios(idVideo),
      obtenerRecomendados(idVideo),
    ])
      .then(([datosVideo, datosComentarios, datosRecomendados]) => {
        setVideo(datosVideo);
        setComentarios(datosComentarios);
        setRecomendados(datosRecomendados);
      })
      .catch((problema) => setError(problema.message));
  }, [idVideo]);

  useEffect(() => {
    if (!video || !reproducirAlCargar.current || !videoElemento.current) return;

    videoElemento.current.play().catch(() => {
      // El navegador puede bloquear el autoplay; los controles siguen disponibles.
    });
    reproducirAlCargar.current = false;
  }, [video]);

  async function enviarComentario(evento) {
    evento.preventDefault();
    if (!nuevoComentario.trim() || enviandoComentario) return;

    setEnviandoComentario(true);
    setErrorComentario("");
    try {
      const comentario = await crearComentario(
        idVideo,
        nuevoComentario,
        usuario.id,
      );
      setComentarios([comentario, ...comentarios]);
      setNuevoComentario("");
    } catch (problema) {
      setErrorComentario(problema.message);
    } finally {
      setEnviandoComentario(false);
    }
  }

  async function registrarReproduccion(evento) {
    if (evento.currentTarget.currentTime < 3) return;

    const claveVista = `frame-vista-v2-${idVideo}`;
    if (sessionStorage.getItem(claveVista)) return;

    sessionStorage.setItem(claveVista, "pendiente");

    try {
      const respuesta = await registrarVista(idVideo);
      setVideo((videoActual) => ({
        ...videoActual,
        views: respuesta.views,
      }));
      sessionStorage.setItem(claveVista, "registrada");
    } catch (problema) {
      sessionStorage.removeItem(claveVista);
      setError(problema.message);
    }
  }

  function cambiarReproduccionContinua(evento) {
    const activada = evento.target.checked;
    setReproduccionContinua(activada);
    localStorage.setItem("reproduccion-continua", String(activada));
  }

  function reproducirSiguiente() {
    if (!reproduccionContinua || recomendados.length === 0) return;
    reproducirAlCargar.current = true;
    alAbrirVideo(recomendados[0].id);
  }

  if (error) return <div className="contenedor estado estado-error">{error}</div>;
  if (!video) return <EsqueletoReproductor />;

  return (
    <div className="contenedor pagina-reproductor">
      <div className="reproductor-layout">
        <aside className="recomendados">
          <div className="encabezado-recomendados">
            <div>
              <p className="etiqueta">COLA DE REPRODUCCION</p>
              <h2>Mas videos</h2>
            </div>
            <label className="control-continuo" title="Reproduccion continua">
              <input
                type="checkbox"
                checked={reproduccionContinua}
                onChange={cambiarReproduccionContinua}
              />
              <span className="interruptor"><span /></span>
              <small>Auto</small>
            </label>
          </div>
          <div className="lista-recomendados">
            {recomendados.map((recomendado) => (
              <TarjetaVideo
                key={recomendado.id}
                video={recomendado}
                alAbrir={alAbrirVideo}
                compacta
              />
            ))}
            {recomendados.length === 0 && (
              <p className="texto-suave">No hay mas videos por ahora.</p>
            )}
          </div>
        </aside>

        <section>
          <video
            ref={videoElemento}
            className="video-principal"
            src={video.video_url}
            poster={video.thumbnail_url}
            controls
            onTimeUpdate={registrarReproduccion}
            onEnded={reproducirSiguiente}
          />

          <div className="informacion-video">
            <h1>{video.title}</h1>
            <div className="linea-autor">
              <Avatar usuario={video.user} />
              <div>
                <strong>{video.user.name}</strong>
                <span>{mostrarFechaCompleta(video.created_at)}</span>
              </div>
              <span className="vistas"><Eye size={17} /> {mostrarVistas(video.views)}</span>
            </div>
            <p className="descripcion-video">
              {video.description || "Este video no tiene descripcion."}
            </p>
          </div>

          <section className="seccion-comentarios">
            <h2><MessageCircle size={21} /> Comentarios <span>{comentarios.length}</span></h2>
            <form className="nuevo-comentario" onSubmit={enviarComentario}>
              <Avatar usuario={usuario} />
              <input
                value={nuevoComentario}
                onChange={(evento) => setNuevoComentario(evento.target.value)}
                placeholder="Escribe un comentario..."
                maxLength="500"
              />
              <button
                className="boton-icono boton-enviar"
                title="Publicar comentario"
                disabled={enviandoComentario}
              >
                <Send size={18} />
              </button>
            </form>
            {errorComentario && <p className="mensaje-error">{errorComentario}</p>}

            <div className="lista-comentarios">
              {comentarios.length === 0 && <p className="texto-suave">Se el primero en comentar.</p>}
              {comentarios.map((comentario) => (
                <article className="comentario" key={comentario.id}>
                  <Avatar usuario={comentario.user} pequeno />
                  <div>
                    <strong>{comentario.user.name}</strong>
                    <time>{mostrarFechaCompleta(comentario.created_at)}</time>
                    <p>{comentario.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

      </div>
    </div>
  );
}
