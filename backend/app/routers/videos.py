from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import obtener_base_datos
from ..services import videos_service


router = APIRouter(prefix="/videos", tags=["Videos"])


@router.post("", response_model=schemas.VideoResponse)
def crear_video(datos_video: schemas.VideoCreate, base_datos: Session = Depends(obtener_base_datos)):
    return videos_service.crear_video(base_datos, datos_video)


@router.get("", response_model=list[schemas.VideoResponse])
def obtener_videos(base_datos: Session = Depends(obtener_base_datos)):
    return videos_service.obtener_videos(base_datos)


@router.get("/{video_id}", response_model=schemas.VideoResponse)
def obtener_video(video_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return videos_service.obtener_video(base_datos, video_id)


@router.post("/{video_id}/view")
def registrar_vista(video_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return {"views": videos_service.registrar_vista(base_datos, video_id)}


@router.put("/{video_id}", response_model=schemas.VideoResponse)
def actualizar_video(video_id: int, datos_video: schemas.VideoUpdate, base_datos: Session = Depends(obtener_base_datos)):
    return videos_service.actualizar_video(base_datos, video_id, datos_video)


@router.delete("/{video_id}")
def eliminar_video(video_id: int, base_datos: Session = Depends(obtener_base_datos)):
    videos_service.eliminar_video(base_datos, video_id)
    return {"message": "Video eliminado correctamente"}


@router.get("/{video_id}/recommended", response_model=list[schemas.VideoResponse])
def obtener_videos_recomendados(video_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return videos_service.obtener_recomendados(base_datos, video_id)
