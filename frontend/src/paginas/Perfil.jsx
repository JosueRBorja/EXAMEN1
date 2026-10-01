import { Camera, Edit3, Film, Save, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  actualizarUsuario,
  actualizarVideo,
  eliminarVideo,
  obtenerPerfil,
  publicarVideo,
  subirArchivo,
} from "../servicios/api";
import Avatar from "../componentes/atomos/Avatar";
import { EsqueletoPerfil } from "../componentes/organismos/EsqueletosCarga";
import { mostrarVistas } from "../utilidades/vistas";

const formularioVacio = {
  titulo: "",
  descripcion: "",
  urlVideo: "",
  urlMiniatura: "",
};

export default function Perfil({ usuario, alAbrirVideo, alSubir, alActualizarUsuario }) {
  const [perfil, setPerfil] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [idEditando, setIdEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEditorPerfil, setMostrarEditorPerfil] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: usuario.name,
    correo: usuario.email,
    avatarUrl: usuario.avatar_url || "",
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [vistaPreviaFoto, setVistaPreviaFoto] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarPerfil() {
    try {
      setPerfil(await obtenerPerfil(usuario.id));
    } catch (problema) {
      setError(problema.message);
    }
  }

  useEffect(() => {
    cargarPerfil();
  }, [usuario.id]);

  useEffect(() => {
    setDatosPerfil({
      nombre: usuario.name,
      correo: usuario.email,
      avatarUrl: usuario.avatar_url || "",
    });
  }, [usuario]);

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function prepararEdicion(video) {
    setIdEditando(video.id);
    setFormulario({
      titulo: video.title,
      descripcion: video.description || "",
      urlVideo: video.video_url,
      urlMiniatura: video.thumbnail_url,
    });
    setMostrarFormulario(true);
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cerrarFormulario() {
    setFormulario(formularioVacio);
    setIdEditando(null);
    setMostrarFormulario(false);
  }

  async function guardarVideo(evento) {
    evento.preventDefault();
    setError("");

    try {
      if (idEditando) {
        await actualizarVideo(idEditando, formulario);
        setMensaje("Video actualizado correctamente.");
      } else {
        await publicarVideo(formulario, usuario.id);
        setMensaje("Video publicado correctamente.");
      }
      cerrarFormulario();
      cargarPerfil();
    } catch (problema) {
      setError(problema.message);
    }
  }

  async function borrarVideo(idVideo) {
    const confirmado = window.confirm("¿Seguro que deseas eliminar este video?");
    if (!confirmado) return;

    try {
      await eliminarVideo(idVideo);
      setMensaje("Video eliminado correctamente.");
      cargarPerfil();
    } catch (problema) {
      setError(problema.message);
    }
  }

  function seleccionarFoto(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    setFotoPerfil(archivo);
    const lector = new FileReader();
    lector.onload = () => setVistaPreviaFoto(lector.result);
    lector.readAsDataURL(archivo);
  }

  function cerrarEditorPerfil() {
    setMostrarEditorPerfil(false);
    setFotoPerfil(null);
    setVistaPreviaFoto("");
    setDatosPerfil({
      nombre: usuario.name,
      correo: usuario.email,
      avatarUrl: usuario.avatar_url || "",
    });
  }

  async function guardarPerfil(evento) {
    evento.preventDefault();
    setGuardandoPerfil(true);
    setError("");
    setMensaje("");

    try {
      let avatarUrl = datosPerfil.avatarUrl;

      if (fotoPerfil) {
        const resultado = await subirArchivo(fotoPerfil, "miniatura");
        avatarUrl = resultado.url;
      }

      const usuarioActualizado = await actualizarUsuario(usuario.id, {
        ...datosPerfil,
        avatarUrl,
      });

      alActualizarUsuario(usuarioActualizado);
      setPerfil({ ...perfil, user: usuarioActualizado });
      setMensaje("Perfil actualizado correctamente.");
      setMostrarEditorPerfil(false);
      setFotoPerfil(null);
      setVistaPreviaFoto("");
    } catch (problema) {
      setError(problema.message);
    } finally {
      setGuardandoPerfil(false);
    }
  }

  if (error && !perfil) {
    return <div className="contenedor estado estado-error">{error}</div>;
  }
  if (!perfil) return <EsqueletoPerfil />;

  return (
    <div className="contenedor pagina-perfil">
      <section className="perfil-cabecera">
        <Avatar usuario={usuario} grande />
        <div>
          <p className="etiqueta">MI CANAL</p>
          <h1>{usuario.name}</h1>
          <p>{usuario.email}</p>
        </div>
        <div className="contador-videos">
          <strong>{perfil.total_videos}</strong>
          <span>videos publicados</span>
        </div>
        <div className="acciones-perfil">
          <button
            className="boton-secundario"
            onClick={() => setMostrarEditorPerfil(true)}
          >
            <Edit3 size={17} /> Editar perfil
          </button>
          <button className="boton-principal" onClick={alSubir}>
            <UploadCloud size={18} /> Publicar video
          </button>
        </div>
      </section>

      {mostrarEditorPerfil && (
        <section className="panel-formulario-video panel-editar-perfil">
          <div className="encabezado-formulario">
            <div>
              <p className="etiqueta">CUENTA</p>
              <h2>Editar perfil</h2>
            </div>
            <button className="boton-icono" onClick={cerrarEditorPerfil} title="Cerrar">
              <X size={20} />
            </button>
          </div>

          <form className="formulario-perfil" onSubmit={guardarPerfil}>
            <div className="editor-foto">
              <Avatar
                usuario={{
                  name: datosPerfil.nombre || usuario.name,
                  avatar_url: vistaPreviaFoto || datosPerfil.avatarUrl,
                }}
                grande
              />
              <label className="selector-foto">
                <Camera size={17} />
                {fotoPerfil ? fotoPerfil.name : "Cambiar foto"}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={seleccionarFoto}
                />
              </label>
            </div>

            <label>
              Nombre
              <input
                value={datosPerfil.nombre}
                onChange={(evento) => setDatosPerfil({
                  ...datosPerfil,
                  nombre: evento.target.value,
                })}
                required
              />
            </label>

            <label>
              Correo
              <input
                type="email"
                value={datosPerfil.correo}
                onChange={(evento) => setDatosPerfil({
                  ...datosPerfil,
                  correo: evento.target.value,
                })}
                required
              />
            </label>

            <button className="boton-principal" disabled={guardandoPerfil}>
              <Save size={18} />
              {guardandoPerfil ? "Guardando..." : "Guardar perfil"}
            </button>
          </form>
        </section>
      )}

      {mostrarFormulario && (
        <section className="panel-formulario-video">
          <div className="encabezado-formulario">
            <div>
              <p className="etiqueta">{idEditando ? "EDICION" : "NUEVA PUBLICACION"}</p>
              <h2>{idEditando ? "Actualizar video" : "Publicar un video"}</h2>
            </div>
            <button className="boton-icono" onClick={cerrarFormulario} title="Cerrar">
              <X size={20} />
            </button>
          </div>

          <form className="formulario-video" onSubmit={guardarVideo}>
            <label>
              Titulo
              <input
                name="titulo"
                value={formulario.titulo}
                onChange={cambiarCampo}
                placeholder="Titulo del video"
                required
              />
            </label>
            <label>
              Descripcion
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={cambiarCampo}
                placeholder="Cuenta de que trata el video"
                rows="4"
              />
            </label>
            <label>
              URL del video MP4
              <input
                name="urlVideo"
                type="url"
                value={formulario.urlVideo}
                onChange={cambiarCampo}
                placeholder="https://bucket-videos.s3.../video.mp4"
                required
              />
            </label>
            <label>
              URL de la miniatura
              <input
                name="urlMiniatura"
                type="url"
                value={formulario.urlMiniatura}
                onChange={cambiarCampo}
                placeholder="https://bucket-miniaturas.s3.../imagen.jpg"
                required
              />
            </label>
            <button className="boton-principal">
              <Save size={18} /> {idEditando ? "Guardar cambios" : "Publicar ahora"}
            </button>
          </form>
        </section>
      )}

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

      <section className="mis-videos">
        <div className="titulo-seccion">
          <div>
            <p className="etiqueta">BIBLIOTECA</p>
            <h2>Mis publicaciones</h2>
          </div>
        </div>

        {perfil.videos.length === 0 && (
          <div className="estado-vacio">
            <span><Film size={30} /></span>
            <h3>Tu canal esta listo</h3>
            <p>Publica tu primer video para verlo aqui.</p>
          </div>
        )}

        <div className="lista-mis-videos">
          {perfil.videos.map((video) => (
            <article className="fila-video" key={video.id}>
              <button className="imagen-fila" onClick={() => alAbrirVideo(video.id)}>
                <img src={video.thumbnail_url} alt={video.title} />
              </button>
              <div className="datos-fila">
                <h3>{video.title}</h3>
                <p>{video.description || "Sin descripcion"}</p>
                <span>{mostrarVistas(video.views)}</span>
              </div>
              <div className="acciones-fila">
                <button
                  className="boton-secundario"
                  onClick={() => prepararEdicion(video)}
                >
                  <Edit3 size={17} /> Editar
                </button>
                <button
                  className="boton-peligro"
                  onClick={() => borrarVideo(video.id)}
                  title="Eliminar video"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
