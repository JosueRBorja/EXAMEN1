import { Eye, ImageOff, Play } from "lucide-react";
import { useState } from "react";
import { mostrarFechaCorta } from "../../utilidades/fechas";
import { mostrarVistas } from "../../utilidades/vistas";

export default function TarjetaVideo({ video, alAbrir, compacta = false }) {
  const [imagenIncorrecta, setImagenIncorrecta] = useState(false);

  function manejarTecla(evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      alAbrir(video.id);
    }
  }

  return (
    <article
      className={`tarjeta-video ${compacta ? "tarjeta-compacta" : ""}`}
      onClick={() => alAbrir(video.id)}
      onKeyDown={manejarTecla}
      role="button"
      tabIndex="0"
    >
      <div className="miniatura">
        {imagenIncorrecta ? (
          <div className="miniatura-vacia"><ImageOff size={30} /></div>
        ) : (
          <img
            src={video.thumbnail_url}
            alt={`Miniatura de ${video.title}`}
            onError={() => setImagenIncorrecta(true)}
          />
        )}
        <span className="reproducir-miniatura"><Play size={18} fill="currentColor" /></span>
      </div>
      <div className="tarjeta-contenido">
        <h3>{video.title}</h3>
        <p>{video.user.name}</p>
        <div className="meta-video">
          <span><Eye size={15} /> {mostrarVistas(video.views)}</span>
          <span>{mostrarFechaCorta(video.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
