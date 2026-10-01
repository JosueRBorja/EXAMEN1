import { Search, SlidersHorizontal, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerVideos } from "../servicios/api";
import TarjetaVideo from "../componentes/moleculas/TarjetaVideo";
import { EsqueletoCatalogo } from "../componentes/organismos/EsqueletosCarga";

export default function TodosVideos({ alAbrirVideo }) {
  const [videos, setVideos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerVideos()
      .then(setVideos)
      .catch((problema) => setError(problema.message))
      .finally(() => setCargando(false));
  }, []);

  const videosVisibles = videos
    .filter((video) => `${video.title} ${video.user.name}`.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => orden === "vistas" ? b.views - a.views : b.id - a.id);

  return (
    <div className="contenedor pagina-inicio">
      <section className="cabecera-catalogo">
        <div>
          <p className="etiqueta">EXPLORAR</p>
          <h1>Todos los videos</h1>
          <p>Encuentra cada publicacion de la comunidad en un solo lugar.</p>
        </div>
        <span className="cantidad-catalogo"><strong>{videos.length}</strong> publicaciones</span>
      </section>

      <section className="barra-catalogo">
        <label className="buscador">
          <Search size={19} />
          <input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por titulo o creador" />
        </label>
        <label className="selector-orden">
          <SlidersHorizontal size={18} />
          <select value={orden} onChange={(evento) => setOrden(evento.target.value)}>
            <option value="recientes">Mas recientes</option>
            <option value="vistas">Mas vistos</option>
          </select>
        </label>
      </section>

      {cargando && <EsqueletoCatalogo />}
      {error && <div className="estado estado-error">{error}</div>}
      {!cargando && !error && videosVisibles.length === 0 && (
        <div className="estado-vacio">
          <span><Video size={30} /></span><h2>No encontramos videos</h2><p>Prueba con una busqueda diferente.</p>
        </div>
      )}
      <section className="cuadricula-videos cuadricula-catalogo">
        {videosVisibles.map((video) => <TarjetaVideo key={video.id} video={video} alAbrir={alAbrirVideo} />)}
      </section>
    </div>
  );
}
