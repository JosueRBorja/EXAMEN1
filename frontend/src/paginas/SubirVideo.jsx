import { UploadCloud } from "lucide-react";
import { useState } from "react";
import ZonaArchivo from "../componentes/moleculas/ZonaArchivo";
import { publicarVideo, subirArchivo } from "../servicios/api";

export default function SubirVideo({ usuario, alCompletar }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivoVideo, setArchivoVideo] = useState(null);
  const [archivoMiniatura, setArchivoMiniatura] = useState(null);
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  async function publicar(evento) {
    evento.preventDefault();
    if (!archivoVideo || !archivoMiniatura) {
      setError("Selecciona el video y la miniatura antes de publicar.");
      return;
    }

    setError("");
    setEstado("Subiendo archivos...");

    try {
      const [videoSubido, miniaturaSubida] = await Promise.all([
        subirArchivo(archivoVideo, "video"),
        subirArchivo(archivoMiniatura, "miniatura"),
      ]);
      setEstado("Guardando publicacion...");
      const videoCreado = await publicarVideo(
        {
          titulo,
          descripcion,
          urlVideo: videoSubido.url,
          urlMiniatura: miniaturaSubida.url,
        },
        usuario.id,
      );
      setEstado("Video publicado correctamente");
      alCompletar(videoCreado.id);
    } catch (problema) {
      setEstado("");
      setError(problema.message);
    }
  }

  const subiendo = Boolean(estado && !estado.includes("correctamente"));

  return (
    <div className="contenedor pagina-subir">
      <section className="cabecera-subir">
        <div>
          <p className="etiqueta">FRAME STUDIO</p>
          <h1>Publica un nuevo video</h1>
          <p>Completa la informacion y arrastra los archivos desde tu computadora.</p>
        </div>
        <span><UploadCloud size={34} /></span>
      </section>

      <form className="editor-publicacion" onSubmit={publicar}>
        <section className="datos-publicacion">
          <div className="encabezado-paso">
            <div className="numero-paso">01</div>
            <div><h2>Informacion</h2><p>Cuenta de que trata tu video.</p></div>
          </div>
          <label>Titulo del video<input value={titulo} onChange={(evento) => setTitulo(evento.target.value)} maxLength="150" required /></label>
          <label>Descripcion<textarea value={descripcion} onChange={(evento) => setDescripcion(evento.target.value)} rows="6" /></label>
        </section>

        <section className="archivos-publicacion">
          <div className="encabezado-paso">
            <div className="numero-paso">02</div>
            <div><h2>Archivos</h2><p>Suelta cada archivo en su espacio.</p></div>
          </div>
          <ZonaArchivo tipo="video" archivo={archivoVideo} alCambiar={setArchivoVideo} />
          <ZonaArchivo tipo="miniatura" archivo={archivoMiniatura} alCambiar={setArchivoMiniatura} />
        </section>

        <footer className="publicar-footer">
          <div>{estado && <p className="mensaje-exito">{estado}</p>}{error && <p className="mensaje-error">{error}</p>}</div>
          <button className="boton-principal" disabled={subiendo}>
            <UploadCloud size={19} /> {subiendo ? "Subiendo..." : "Publicar video"}
          </button>
        </footer>
      </form>
    </div>
  );
}
