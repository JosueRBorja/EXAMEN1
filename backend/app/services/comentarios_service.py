from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..repositories import comentarios_repository, usuarios_repository, videos_repository


def crear_comentario(base_datos: Session, video_id: int, datos: schemas.CommentCreate):
    if not videos_repository.obtener_por_id(base_datos, video_id):
        raise HTTPException(status_code=404, detail="Video no encontrado")
    if not usuarios_repository.obtener_por_id(base_datos, datos.user_id):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    contenido = datos.content.strip()
    if not contenido:
        raise HTTPException(status_code=400, detail="El comentario no puede estar vacio")
    return comentarios_repository.crear(base_datos, contenido, datos.user_id, video_id)


def obtener_comentarios(base_datos: Session, video_id: int):
    if not videos_repository.obtener_por_id(base_datos, video_id):
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return comentarios_repository.listar_por_video(base_datos, video_id)
