from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..repositories import usuarios_repository, videos_repository
from ..storage import eliminar_archivo


def crear_video(base_datos: Session, datos: schemas.VideoCreate):
    if not usuarios_repository.obtener_por_id(base_datos, datos.user_id):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return videos_repository.crear(base_datos, datos.model_dump())


def obtener_videos(base_datos: Session):
    return videos_repository.listar_todos(base_datos)


def obtener_video(base_datos: Session, video_id: int):
    video = videos_repository.obtener_por_id(base_datos, video_id, cargar_usuario=True)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return video


def registrar_vista(base_datos: Session, video_id: int):
    vistas = videos_repository.incrementar_vistas(base_datos, video_id)
    if vistas is None:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return vistas


def actualizar_video(base_datos: Session, video_id: int, datos: schemas.VideoUpdate):
    video = obtener_video(base_datos, video_id)
    cambios = datos.model_dump(exclude_unset=True)
    if cambios.get("video_url") not in (None, video.video_url):
        eliminar_archivo(video.video_url)
    if cambios.get("thumbnail_url") not in (None, video.thumbnail_url):
        eliminar_archivo(video.thumbnail_url)
    return videos_repository.actualizar(base_datos, video, cambios)


def eliminar_video(base_datos: Session, video_id: int):
    video = obtener_video(base_datos, video_id)
    eliminar_archivo(video.video_url)
    eliminar_archivo(video.thumbnail_url)
    videos_repository.eliminar(base_datos, video)


def obtener_recomendados(base_datos: Session, video_id: int):
    obtener_video(base_datos, video_id)
    return videos_repository.listar_recomendados(base_datos, video_id)
