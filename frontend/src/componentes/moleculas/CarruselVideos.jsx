import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import TarjetaVideo from "./TarjetaVideo";

export default function CarruselVideos({ videos, alAbrir }) {
  const [inicio, setInicio] = useState(0);

  const videosOrdenados = videos.map(
    (_, posicion) => videos[(inicio + posicion) % videos.length],
  );

  function mover(pasos) {
    setInicio((indiceActual) => (
      (indiceActual + pasos + videos.length) % videos.length
    ));
  }

  return (
    <div className="carrusel-videos">
      {videos.length > 1 && (
        <div className="controles-carrusel">
          <button
            className="boton-icono"
            onClick={() => mover(-1)}
            title="Videos anteriores"
            aria-label="Videos anteriores"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="boton-icono"
            onClick={() => mover(1)}
            title="Videos siguientes"
            aria-label="Videos siguientes"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div className="ventana-carrusel">
        <div className="pista-carrusel" key={inicio}>
          {videosOrdenados.map((video) => (
            <TarjetaVideo key={video.id} video={video} alAbrir={alAbrir} />
          ))}
        </div>
      </div>
    </div>
  );
}
