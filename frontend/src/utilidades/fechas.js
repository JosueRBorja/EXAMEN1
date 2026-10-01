function convertirFechaUtc(fecha) {
  if (!fecha) return null;
  const tieneZona = /(?:Z|[+-]\d{2}:\d{2})$/.test(fecha);
  return new Date(tieneZona ? fecha : `${fecha}Z`);
}

export function mostrarFechaCompleta(fecha) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Guayaquil",
  }).format(convertirFechaUtc(fecha));
}

export function mostrarFechaCorta(fecha) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Guayaquil",
  }).format(convertirFechaUtc(fecha));
}
