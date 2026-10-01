function BloqueEsqueleto({ clase = "" }) {
  return <span className={`esqueleto ${clase}`} aria-hidden="true" />;
}

function TarjetaEsqueleto({ compacta = false }) {
  return (
    <div className={compacta ? "esqueleto-tarjeta esqueleto-tarjeta-compacta" : "esqueleto-tarjeta"}>
      <BloqueEsqueleto clase="esqueleto-miniatura" />
      <div className="esqueleto-datos">
        <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
        <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-corta" />
        <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-media" />
      </div>
    </div>
  );
}

export function EsqueletoInicio() {
  return (
    <div className="contenedor pagina-inicio carga-esqueleto" role="status" aria-label="Cargando inicio">
      <BloqueEsqueleto clase="esqueleto-portada" />
      <div className="esqueleto-accesos">
        <BloqueEsqueleto />
        <BloqueEsqueleto />
      </div>
      <div className="esqueleto-encabezado">
        <div>
          <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-corta" />
          <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
        </div>
      </div>
      <div className="esqueleto-cuadricula">
        {Array.from({ length: 3 }, (_, indice) => <TarjetaEsqueleto key={indice} />)}
      </div>
    </div>
  );
}

export function EsqueletoCatalogo() {
  return (
    <div className="esqueleto-cuadricula esqueleto-cuadricula-catalogo" role="status" aria-label="Cargando videos">
      {Array.from({ length: 8 }, (_, indice) => <TarjetaEsqueleto key={indice} />)}
    </div>
  );
}

export function EsqueletoReproductor() {
  return (
    <div className="contenedor pagina-reproductor carga-esqueleto" role="status" aria-label="Cargando reproductor">
      <div className="reproductor-layout">
        <aside className="esqueleto-recomendados">
          <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
          {Array.from({ length: 4 }, (_, indice) => <TarjetaEsqueleto compacta key={indice} />)}
        </aside>
        <section>
          <BloqueEsqueleto clase="esqueleto-video" />
          <div className="esqueleto-informacion">
            <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-grande" />
            <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-media" />
            <BloqueEsqueleto clase="esqueleto-descripcion" />
          </div>
          <div className="esqueleto-comentarios">
            <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
            <BloqueEsqueleto clase="esqueleto-campo" />
          </div>
        </section>
      </div>
    </div>
  );
}

export function EsqueletoPerfil() {
  return (
    <div className="contenedor pagina-perfil carga-esqueleto" role="status" aria-label="Cargando perfil">
      <section className="esqueleto-perfil-cabecera">
        <BloqueEsqueleto clase="esqueleto-avatar" />
        <div>
          <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
          <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-media" />
        </div>
        <BloqueEsqueleto clase="esqueleto-boton" />
      </section>
      <div className="esqueleto-encabezado">
        <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
      </div>
      <div className="esqueleto-lista-perfil">
        {Array.from({ length: 3 }, (_, indice) => (
          <div className="esqueleto-fila" key={indice}>
            <BloqueEsqueleto clase="esqueleto-miniatura" />
            <div>
              <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-titulo" />
              <BloqueEsqueleto clase="esqueleto-linea esqueleto-linea-media" />
            </div>
            <BloqueEsqueleto clase="esqueleto-boton" />
          </div>
        ))}
      </div>
    </div>
  );
}
