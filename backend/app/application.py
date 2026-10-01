import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, aplicar_migraciones_basicas, motor
from .routers import archivos, comentarios, usuarios, videos
from .storage import CARPETA_UPLOADS, preparar_carpetas


Base.metadata.create_all(bind=motor)
aplicar_migraciones_basicas()
preparar_carpetas()

app = FastAPI(title="Plataforma de Videos API")

ORIGENES_PERMITIDOS = [
    origen.strip()
    for origen in os.getenv(
        "CORS_ORIGINS",
        "http://127.0.0.1:5173,http://localhost:5173",
    ).split(",")
    if origen.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENES_PERMITIDOS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=CARPETA_UPLOADS), name="media")
app.include_router(archivos.router)
app.include_router(usuarios.router)
app.include_router(videos.router)
app.include_router(comentarios.router)


@app.get("/")
def inicio():
    return {"message": "API de plataforma de videos funcionando"}
