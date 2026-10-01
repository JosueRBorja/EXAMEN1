import { Clapperboard, Home, LogOut, Play, UploadCloud, UserRound } from "lucide-react";
import Avatar from "../atomos/Avatar";

export default function Encabezado({ pagina, usuario, alNavegar, alCerrarSesion }) {
  return (
    <header className="encabezado">
      <button className="marca" onClick={() => alNavegar("inicio")}>
        <span className="marca-icono"><Play size={17} fill="currentColor" /></span>
        <span>FRAME</span>
      </button>

      <nav className="navegacion" aria-label="Navegacion principal">
        <button aria-label="Inicio" className={pagina === "inicio" ? "nav-activo" : ""} onClick={() => alNavegar("inicio")}>
          <Home size={19} /><span>Inicio</span>
        </button>
        <button aria-label="Todos los videos" className={pagina === "videos" || pagina === "reproductor" ? "nav-activo" : ""} onClick={() => alNavegar("videos")}>
          <Clapperboard size={19} /><span>Videos</span>
        </button>
        <button aria-label="Subir video" className={pagina === "subir" ? "nav-activo" : ""} onClick={() => alNavegar("subir")}>
          <UploadCloud size={19} /><span>Subir</span>
        </button>
        <button aria-label="Mi perfil" className={pagina === "perfil" ? "nav-activo" : ""} onClick={() => alNavegar("perfil")}>
          <UserRound size={19} /><span>Mi perfil</span>
        </button>
      </nav>

      <div className="usuario-menu">
        <button
          className="enlace-perfil"
          onClick={() => alNavegar("perfil")}
          title="Abrir mi perfil"
          aria-label={`Abrir perfil de ${usuario.name}`}
        >
          <Avatar usuario={usuario} />
          <span className="nombre-usuario">{usuario.name}</span>
        </button>
        <button className="boton-icono" onClick={alCerrarSesion} title="Cerrar sesion" aria-label="Cerrar sesion">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}
