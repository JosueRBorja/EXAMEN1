from sqlalchemy.orm import Session, joinedload

from .. import models


def crear(base_datos: Session, contenido: str, user_id: int, video_id: int):
    comentario = models.Comment(content=contenido, user_id=user_id, video_id=video_id)
    base_datos.add(comentario)
    base_datos.commit()
    base_datos.refresh(comentario)
    return comentario


def listar_por_video(base_datos: Session, video_id: int):
    return (
        base_datos.query(models.Comment)
        .options(joinedload(models.Comment.user))
        .filter(models.Comment.video_id == video_id)
        .order_by(models.Comment.created_at.desc())
        .all()
    )
