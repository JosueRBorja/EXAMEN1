const URL_API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function solicitar(ruta, opciones = {}) {
  const esFormulario = opciones.body instanceof FormData;
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    headers: esFormulario ? {} : { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const detalle = Array.isArray(datos.detail)
      ? datos.detail.map((error) => error.msg).join(". ")
      : datos.detail;
    throw new Error(detalle || "No se pudo completar la solicitud");
  }
  return datos;
}

export function subirArchivo(archivo, tipo) {
  const formulario = new FormData();
  formulario.append("archivo", archivo);
  const ruta = tipo === "video" ? "/uploads/video" : "/uploads/thumbnail";
  return solicitar(ruta, { method: "POST", body: formulario });
}

export function registrarUsuario(datos) {
  return solicitar("/users", {
    method: "POST",
    body: JSON.stringify({
      name: datos.nombre,
      email: datos.correo,
      password: datos.contrasena,
    }),
  });
}

export function iniciarSesion(datos) {
  return solicitar("/login", {
    method: "POST",
    body: JSON.stringify({ email: datos.correo, password: datos.contrasena }),
  });
}

export function actualizarUsuario(idUsuario, datos) {
  return solicitar(`/users/${idUsuario}`, {
    method: "PUT",
    body: JSON.stringify({
      name: datos.nombre,
      email: datos.correo,
      avatar_url: datos.avatarUrl || null,
    }),
  });
}

export function obtenerVideos() {
  return solicitar("/videos");
}

export function obtenerVideo(idVideo) {
  return solicitar(`/videos/${idVideo}`);
}

export function registrarVista(idVideo) {
  return solicitar(`/videos/${idVideo}/view`, { method: "POST" });
}

export function obtenerRecomendados(idVideo) {
  return solicitar(`/videos/${idVideo}/recommended`);
}

export function obtenerComentarios(idVideo) {
  return solicitar(`/videos/${idVideo}/comments`);
}

export function crearComentario(idVideo, contenido, idUsuario) {
  return solicitar(`/videos/${idVideo}/comments`, {
    method: "POST",
    body: JSON.stringify({ content: contenido, user_id: idUsuario }),
  });
}

export function obtenerPerfil(idUsuario) {
  return solicitar(`/users/${idUsuario}/videos`);
}

export function publicarVideo(datos, idUsuario) {
  return solicitar("/videos", {
    method: "POST",
    body: JSON.stringify({
      title: datos.titulo,
      description: datos.descripcion,
      video_url: datos.urlVideo,
      thumbnail_url: datos.urlMiniatura,
      user_id: idUsuario,
    }),
  });
}

export function actualizarVideo(idVideo, datos) {
  return solicitar(`/videos/${idVideo}`, {
    method: "PUT",
    body: JSON.stringify({
      title: datos.titulo,
      description: datos.descripcion,
      video_url: datos.urlVideo,
      thumbnail_url: datos.urlMiniatura,
    }),
  });
}

export function eliminarVideo(idVideo) {
  return solicitar(`/videos/${idVideo}`, { method: "DELETE" });
}
