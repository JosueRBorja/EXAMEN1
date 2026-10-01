import { useState } from "react";
import Encabezado from "./componentes/organismos/Encabezado";
import Acceso from "./paginas/Acceso";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";
import Reproductor from "./paginas/Reproductor";
import SubirVideo from "./paginas/SubirVideo";
import TodosVideos from "./paginas/TodosVideos";

function leerUsuarioGuardado() {
  const usuarioGuardado = localStorage.getItem("usuario");
  return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
}

export default function App() {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);
  const [pagina, setPagina] = useState(usuario ? "inicio" : "acceso");
  const [idVideo, setIdVideo] = useState(null);

  function guardarSesion(nuevoUsuario) {
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
    setPagina("inicio");
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setPagina("acceso");
  }

  function actualizarSesion(usuarioActualizado) {
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  }

  function abrirVideo(nuevoIdVideo) {
    setIdVideo(nuevoIdVideo);
    setPagina("reproductor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!usuario) {
    return <Acceso alIngresar={guardarSesion} />;
  }

  return (
    <div className="aplicacion">
      <Encabezado
        pagina={pagina}
        usuario={usuario}
        alNavegar={setPagina}
        alCerrarSesion={cerrarSesion}
      />

      <main>
        {pagina === "inicio" && (
          <Inicio alAbrirVideo={abrirVideo} alNavegar={setPagina} />
        )}
        {pagina === "videos" && <TodosVideos alAbrirVideo={abrirVideo} />}
        {pagina === "subir" && (
          <SubirVideo usuario={usuario} alCompletar={abrirVideo} />
        )}
        {pagina === "reproductor" && (
          <Reproductor
            idVideo={idVideo}
            usuario={usuario}
            alAbrirVideo={abrirVideo}
          />
        )}
        {pagina === "perfil" && (
          <Perfil
            usuario={usuario}
            alAbrirVideo={abrirVideo}
            alSubir={() => setPagina("subir")}
            alActualizarUsuario={actualizarSesion}
          />
        )}
      </main>
    </div>
  );
}
