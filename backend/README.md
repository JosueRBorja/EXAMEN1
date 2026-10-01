# Backend - Plataforma de Videos

API basica con FastAPI para una plataforma de videos.

## Ejecutar localmente

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

La documentacion estara disponible en:

```text
http://127.0.0.1:8000/docs
```

## Endpoints principales

### Usuarios

```text
POST /users
POST /login
GET  /users/{id}
PUT  /users/{id}
GET  /users/{id}/videos
```

### Videos

```text
POST   /videos
GET    /videos
GET    /videos/{id}
POST   /videos/{id}/view
PUT    /videos/{id}
DELETE /videos/{id}
GET    /videos/{id}/recommended
```

### Archivos

```text
POST /uploads/video
POST /uploads/thumbnail
```

En modo local los archivos se guardan en `backend/uploads/`. Para publicar un
video primero se suben los dos archivos y luego se guardan sus URLs con
`POST /videos`.

### Comentarios

```text
POST /videos/{id}/comments
GET  /videos/{id}/comments
```

## Notas para AWS

- RDS guarda usuarios, videos y comentarios.
- Para activar S3 usa `STORAGE_DRIVER=s3` en el archivo `.env`.
- S3 Videos guarda archivos `.mp4` de hasta 100 MB.
- S3 Miniaturas guarda miniaturas y fotos de perfil `.jpg`, `.jpeg` o `.png`.
- Configura `S3_VIDEOS_BUCKET`, `S3_THUMBNAILS_BUCKET` y `AWS_REGION`.
- La API guarda en RDS las URLs de S3 en `video_url` y `thumbnail_url`.
- Para PostgreSQL en RDS usa una URL tipo `postgresql+psycopg://usuario:password@host:5432/base`.
- No coloques credenciales en el codigo. Usa variables de entorno en EC2.

## Organizacion por capas

- `app/routers/`: rutas HTTP de FastAPI.
- `app/services/`: validaciones y reglas del sistema.
- `app/repositories/`: consultas SQLAlchemy.
- `app/models.py`: entidades de la base de datos.
- `app/schemas.py`: datos de entrada y respuesta.
- `app/application.py`: configuracion de FastAPI.
- `app/main.py`: entrada compatible para Uvicorn.

## Pruebas

```powershell
.venv\Scripts\python.exe -B -m unittest tests.test_flujo_local -v
```
