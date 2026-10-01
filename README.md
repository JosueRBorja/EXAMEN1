# FRAME - Plataforma de videos

SPA de videos desarrollada con React, Vite y FastAPI. En desarrollo utiliza
SQLite y almacenamiento local. En AWS esta preparada para utilizar S3, EC2 y
PostgreSQL o MySQL en RDS.

## Funciones

- Registro e inicio de sesion.
- Catalogo, busqueda, carrusel y videos recomendados.
- Reproductor con vistas y reproduccion continua.
- Comentarios con fecha y hora.
- Perfil editable y gestion de publicaciones.
- Subida por arrastrar y soltar de MP4 y miniaturas.
- Interfaz responsive con skeleton loaders.

## Requisitos

- Python 3.11 o superior.
- Node.js 20 o superior.
- PM2 instalado por las dependencias del proyecto.

## Instalacion local en Windows

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env

cd ..\frontend
npm install
Copy-Item .env.example .env

cd ..
npm install
npm run local
```

Direcciones locales:

- Frontend: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

Comandos PM2:

```powershell
npm run estado
npm run logs
npm run detener
```

## Variables de entorno

Los archivos `.env` no se suben a GitHub. Usa como base:

- `backend/.env.example`
- `frontend/.env.example`

No coloques claves de AWS en el proyecto. En EC2 se utilizara un IAM Role.

## Arquitectura

Backend por capas:

```text
backend/app/routers/       rutas HTTP
backend/app/services/      reglas de la aplicacion
backend/app/repositories/  acceso a la base de datos
backend/app/models.py      entidades SQLAlchemy
backend/app/schemas.py     validacion de datos
backend/app/storage.py     almacenamiento local o S3
```

Frontend con Atomic Design basico:

```text
frontend/src/componentes/atomos/       piezas pequenas
frontend/src/componentes/moleculas/    componentes reutilizables
frontend/src/componentes/organismos/   secciones completas
frontend/src/paginas/                  pantallas de la SPA
frontend/src/servicios/                conexion con FastAPI
frontend/src/utilidades/               funciones compartidas
```

## Verificacion

```powershell
cd backend
.venv\Scripts\python.exe -B -m unittest tests.test_flujo_local -v

cd ..\frontend
npm run build
```

La prueba del backend utiliza una base temporal y no modifica `videos.db`.

## Conteo de vistas

Una vista se registra cuando el video alcanza tres segundos de reproduccion.
Cada navegador registra una sola vista por video durante la sesion abierta y
el backend incrementa el contador de manera atomica.

## Archivos que no se publican

El `.gitignore` excluye dependencias, entornos virtuales, variables privadas,
la base SQLite, videos locales, miniaturas locales y la carpeta compilada
`dist/`.

## Preparacion para AWS

- `ecosystem.config.cjs`: ejecucion local en Windows.
- `ecosystem.ec2.config.cjs`: ejecucion de FastAPI con PM2 en EC2 Linux.
- `STORAGE_DRIVER=s3`: activa los buckets de videos y miniaturas.
- `DATABASE_URL`: conecta SQLAlchemy con RDS.
- `VITE_API_URL`: indica al frontend la URL publica de EC2.

El despliegue detallado se realizara despues de crear los recursos AWS.

## Publicar en GitHub

Despues de crear un repositorio vacio en GitHub:

```powershell
git add .
git commit -m "Proyecto inicial plataforma de videos"
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```
