import { CheckCircle2, FileImage, Film, X } from "lucide-react";
import { useState } from "react";

export default function ZonaArchivo({ tipo, archivo, alCambiar }) {
  const [arrastrando, setArrastrando] = useState(false);
  const esVideo = tipo === "video";
  const aceptar = esVideo ? "video/mp4" : "image/jpeg,image/png";

  function recibirArchivo(listaArchivos) {
    const nuevoArchivo = listaArchivos?.[0];
    if (nuevoArchivo) alCambiar(nuevoArchivo);
  }

  return (
    <label
      className={`zona-archivo ${arrastrando ? "zona-activa" : ""} ${archivo ? "zona-completa" : ""}`}
      onDragOver={(evento) => { evento.preventDefault(); setArrastrando(true); }}
      onDragLeave={() => setArrastrando(false)}
      onDrop={(evento) => {
        evento.preventDefault();
        setArrastrando(false);
        recibirArchivo(evento.dataTransfer.files);
      }}
    >
      <input type="file" accept={aceptar} onChange={(evento) => recibirArchivo(evento.target.files)} />
      {archivo ? (
        <>
          <span className="archivo-listo"><CheckCircle2 size={27} /></span>
          <strong>{archivo.name}</strong>
          <small>{(archivo.size / 1024 / 1024).toFixed(2)} MB</small>
          <button type="button" onClick={(evento) => { evento.preventDefault(); alCambiar(null); }}>
            <X size={17} /> Quitar
          </button>
        </>
      ) : (
        <>
          <span>{esVideo ? <Film size={31} /> : <FileImage size={31} />}</span>
          <strong>{esVideo ? "Arrastra tu video MP4" : "Arrastra la miniatura"}</strong>
          <small>{esVideo ? "Maximo 100 MB" : "JPG o PNG, maximo 5 MB"}</small>
          <b>o selecciona un archivo</b>
        </>
      )}
    </label>
  );
}
