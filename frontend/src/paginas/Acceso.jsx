import { Clapperboard, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { iniciarSesion, registrarUsuario } from "../servicios/api";

const formularioVacio = { nombre: "", correo: "", contrasena: "" };

export default function Acceso({ alIngresar }) {
  const [modo, setModo] = useState("login");
  const [formulario, setFormulario] = useState(formularioVacio);
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setMensajeError("");
    setCargando(true);

    try {
      if (modo === "registro") {
        const usuario = await registrarUsuario(formulario);
        alIngresar(usuario);
      } else {
        const respuesta = await iniciarSesion(formulario);
        alIngresar(respuesta.user);
      }
    } catch (error) {
      setMensajeError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setMensajeError("");
  }

  return (
    <main className="pagina-acceso">
      <section className="presentacion-acceso">
        <div className="marca-acceso">
          <span><Clapperboard size={23} /></span>
          FRAME
        </div>
        <div>
          <p className="etiqueta">TU ESPACIO PARA CREAR</p>
          <h1>Historias que merecen ser vistas.</h1>
          <p className="texto-presentacion">
            Publica tus videos, descubre nuevas ideas y conversa con otros
            creadores desde un solo lugar.
          </p>
        </div>
        <div className="cinta-visual" aria-hidden="true">
          <span>PUBLICA</span><i></i><span>DESCUBRE</span><i></i><span>COMPARTE</span>
        </div>
      </section>

      <section className="panel-acceso">
        <div className="formulario-acceso">
          <div className="selector-modo">
            <button
              className={modo === "login" ? "activo" : ""}
              onClick={() => cambiarModo("login")}
              type="button"
            >
              Iniciar sesion
            </button>
            <button
              className={modo === "registro" ? "activo" : ""}
              onClick={() => cambiarModo("registro")}
              type="button"
            >
              Crear cuenta
            </button>
          </div>

          <div className="titulo-formulario">
            <h2>{modo === "login" ? "Que bueno verte" : "Crea tu perfil"}</h2>
            <p>
              {modo === "login"
                ? "Ingresa para continuar explorando."
                : "Solo necesitas tres datos para empezar."}
            </p>
          </div>

          <form onSubmit={enviarFormulario}>
            {modo === "registro" && (
              <label>
                Nombre
                <span className="campo-con-icono">
                  <UserRound size={18} />
                  <input
                    name="nombre"
                    value={formulario.nombre}
                    onChange={cambiarCampo}
                    placeholder="Tu nombre"
                    required
                  />
                </span>
              </label>
            )}
            <label>
              Correo electronico
              <span className="campo-con-icono">
                <Mail size={18} />
                <input
                  name="correo"
                  type="email"
                  value={formulario.correo}
                  onChange={cambiarCampo}
                  placeholder="nombre@correo.com"
                  required
                />
              </span>
            </label>
            <label>
              Contrasena
              <span className="campo-con-icono">
                <LockKeyhole size={18} />
                <input
                  name="contrasena"
                  type="password"
                  value={formulario.contrasena}
                  onChange={cambiarCampo}
                  placeholder="Minimo 6 caracteres"
                  minLength="6"
                  required
                />
              </span>
            </label>

            {mensajeError && <p className="mensaje-error">{mensajeError}</p>}

            <button className="boton-principal boton-ancho" disabled={cargando}>
              {cargando
                ? "Procesando..."
                : modo === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
