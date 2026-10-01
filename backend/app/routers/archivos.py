from fastapi import APIRouter, File, UploadFile

from ..storage import guardar_archivo


router = APIRouter(prefix="/uploads", tags=["Archivos"])


@router.post("/video")
async def subir_archivo_video(archivo: UploadFile = File(...)):
    url = await guardar_archivo(archivo, "video")
    return {"url": url, "nombre": archivo.filename}


@router.post("/thumbnail")
async def subir_archivo_miniatura(archivo: UploadFile = File(...)):
    url = await guardar_archivo(archivo, "miniatura")
    return {"url": url, "nombre": archivo.filename}
