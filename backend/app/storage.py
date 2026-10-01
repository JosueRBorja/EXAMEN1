import os
from pathlib import Path
from uuid import uuid4

import boto3
from fastapi import HTTPException, UploadFile


CARPETA_UPLOADS = Path(__file__).resolve().parent.parent / "uploads"
CARPETA_VIDEOS = CARPETA_UPLOADS / "videos"
CARPETA_MINIATURAS = CARPETA_UPLOADS / "miniaturas"

CONTROLADOR_ALMACENAMIENTO = os.getenv("STORAGE_DRIVER", "local")
URL_API = os.getenv("APP_URL", "http://127.0.0.1:8000")
REGION_AWS = os.getenv("AWS_REGION", "us-east-1")

TIPOS_CONTENIDO_VIDEO = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".m4v": "video/x-m4v",
    ".webm": "video/webm",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".ogv": "video/ogg",
    ".wmv": "video/x-ms-wmv",
}


def preparar_carpetas():
    CARPETA_VIDEOS.mkdir(parents=True, exist_ok=True)
    CARPETA_MINIATURAS.mkdir(parents=True, exist_ok=True)


def eliminar_archivo(url: str):
    if CONTROLADOR_ALMACENAMIENTO == "s3":
        buckets = {
            os.getenv("S3_VIDEOS_BUCKET"),
            os.getenv("S3_THUMBNAILS_BUCKET"),
        }
        for bucket in buckets:
            prefijo = f"https://{bucket}.s3.{REGION_AWS}.amazonaws.com/"
            if bucket and url.startswith(prefijo):
                clave = url.removeprefix(prefijo)
                boto3.client("s3", region_name=REGION_AWS).delete_object(
                    Bucket=bucket,
                    Key=clave,
                )
                return

    prefijo_local = f"{URL_API}/media/"
    if not url.startswith(prefijo_local):
        return

    ruta_relativa = url.removeprefix(prefijo_local)
    ruta_archivo = (CARPETA_UPLOADS / ruta_relativa).resolve()
    carpeta_segura = CARPETA_UPLOADS.resolve()

    if carpeta_segura in ruta_archivo.parents and ruta_archivo.is_file():
        ruta_archivo.unlink()


async def guardar_archivo(archivo: UploadFile, tipo: str) -> str:
    extension = Path(archivo.filename or "").suffix.lower()

    if tipo == "video":
        extensiones = set(TIPOS_CONTENIDO_VIDEO)
        tamano_maximo = 100 * 1024 * 1024
        carpeta = CARPETA_VIDEOS
        bucket = os.getenv("S3_VIDEOS_BUCKET")
        tipo_contenido = TIPOS_CONTENIDO_VIDEO.get(extension, "video/mp4")
    else:
        extensiones = {".jpg", ".jpeg", ".png"}
        tamano_maximo = 5 * 1024 * 1024
        carpeta = CARPETA_MINIATURAS
        bucket = os.getenv("S3_THUMBNAILS_BUCKET")
        tipo_contenido = archivo.content_type or "application/octet-stream"

    if extension not in extensiones:
        formatos = ", ".join(sorted(extensiones))
        raise HTTPException(status_code=400, detail=f"Formato permitido: {formatos}")

    contenido = await archivo.read()
    if len(contenido) > tamano_maximo:
        limite_mb = tamano_maximo // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"El archivo supera el limite de {limite_mb} MB",
        )

    nombre_archivo = f"{uuid4().hex}{extension}"

    if CONTROLADOR_ALMACENAMIENTO == "s3":
        if not bucket:
            raise HTTPException(status_code=500, detail="Bucket S3 no configurado")

        cliente_s3 = boto3.client("s3", region_name=REGION_AWS)
        cliente_s3.put_object(
            Bucket=bucket,
            Key=nombre_archivo,
            Body=contenido,
            ContentType=tipo_contenido,
        )
        return f"https://{bucket}.s3.{REGION_AWS}.amazonaws.com/{nombre_archivo}"

    preparar_carpetas()
    ruta_archivo = carpeta / nombre_archivo
    ruta_archivo.write_bytes(contenido)
    nombre_carpeta = "videos" if tipo == "video" else "miniaturas"
    return f"{URL_API}/media/{nombre_carpeta}/{nombre_archivo}"
