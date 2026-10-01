import { ArrowRight, Flame, Play, UploadCloud, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerVideos } from "../servicios/api";
import CarruselVideos from "../componentes/moleculas/CarruselVideos";
import { EsqueletoInicio } from "../componentes/organismos/EsqueletosCarga";
import { mostrarVistas } from "../utilidades/vistas";

export default function InicioNuevo({ alAbrirVideo, alNavegar }) {
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerVideos()
      .then(setVideos)
      .catch((problema) => setError(problema.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <EsqueletoInicio />;
  if (error) return <div className="contenedor estado estado-error">{error}</div>;

  const videoDestacado = videos[0];
  const recientes = videos.slice(0, 6);
  const populares = [...videos].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className="contenedor pagina-inicio">
      {videoDestacado ? (
        <section className="portada-video" onClick={() => alAbrirVideo(videoDestacado.id)}>
          <img src={videoDestacado.thumbnail_url} alt={videoDestacado.title} />
          <div className="portada-sombra"></div>
          <div className="portada-contenido">
            <p className="etiqueta etiqueta-clara">DESTACADO DE HOY</p>
            <h1>{videoDestacado.title}</h1>
            <p>{videoDestacado.description || "Descubre este video de la comunidad."}</p>
            <button className="boton-claro">
              <Play size={18} fill="currentColor" /> Reproducir
            </button>
          </div>
        </section>
      ) : (
        <section className="bienvenida-vacia">
          <div>
            <p className="etiqueta">BIENVENIDO A FRAME</p>
            <h1>Tu comunidad empieza con una historia.</h1>
            <p>Sube el primer video y construye tu canal desde aqui.</p>
          </div>
          <button className="boton-principal" onClick={() => alNavegar("subir")}>
            <UploadCloud size={19} /> Subir video
          </button>
        </section>
      )}

      <section className="accesos-rapidos">
        <button onClick={() => alNavegar("videos")}>
          <span><Video size={22} /></span>
          <div><strong>Todos los videos</strong><small>Explora el catalogo completo</small></div>
          <ArrowRight size={19} />
        </button>
        <button onClick={() => alNavegar("subir")}>
          <span className="icono-verde"><UploadCloud size={22} /></span>
          <div><strong>Publica algo nuevo</strong><small>Arrastra tu MP4 y miniatura</small></div>
          <ArrowRight size={19} />
        </button>
      </section>

      {recientes.length > 0 && (
        <section className="bloque-videos">
          <div className="titulo-con-accion">
            <div><p className="etiqueta">RECIEN PUBLICADOS</p><h2>Videos nuevos</h2></div>
            <button onClick={() => alNavegar("videos")}>Ver todos <ArrowRight size={17} /></button>
          </div>
          <CarruselVideos videos={recientes} alAbrir={alAbrirVideo} />
        </section>
      )}

      {populares.length > 1 && (
        <section className="bloque-populares">
          <div className="titulo-con-accion">
            <div><p className="etiqueta">MAS VISTOS</p><h2><Flame size={23} /> Tendencias</h2></div>
          </div>
          <div className="lista-populares">
            {populares.map((video, indice) => (
              <button key={video.id} onClick={() => alAbrirVideo(video.id)}>
                <strong>{String(indice + 1).padStart(2, "0")}</strong>
                <img src={video.thumbnail_url} alt="" />
                <span><b>{video.title}</b><small>{video.user.name} - {mostrarVistas(video.views)}</small></span>
                <Play size={18} />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
