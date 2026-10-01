# Frontend de la plataforma de videos

Frontend creado con React y Vite. Se conecta con la API FastAPI mediante la
variable `VITE_API_URL`.

## Ejecutar localmente

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Abre `http://127.0.0.1:5173`.

## Paginas

- Inicio con videos destacados y tendencias.
- Catalogo con todos los videos, busqueda y orden.
- Reproductor individual con recomendaciones a la izquierda.
- Subida de MP4 y miniatura por arrastrar y soltar.
- Perfil para cambiar nombre, correo y foto, y para editar o eliminar publicaciones.

## Atomic Design basico

```text
src/componentes/atomos       Avatar y piezas pequenas
src/componentes/moleculas    Tarjetas y zonas de archivos
src/componentes/organismos   Encabezado y navegacion
src/paginas                  Pantallas completas
src/servicios                Peticiones a FastAPI
src/utilidades               Fechas y funciones compartidas
```

## Crear version para Amazon S3

```bash
npm run build
```

Sube solamente el contenido de la carpeta `dist/` al bucket S3 del frontend.
