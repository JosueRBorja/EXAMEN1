from sqlalchemy.orm import Session, joinedload

from .. import models


def obtener_por_id(base_datos: Session, video_id: int, cargar_usuario: bool = False):
    consulta = base_datos.query(models.Video)
    if cargar_usuario:
        consulta = consulta.options(joinedload(models.Video.user))
    return consulta.filter(models.Video.id == video_id).first()


def listar_todos(base_datos: Session):
    return (
        base_datos.query(models.Video)
        .options(joinedload(models.Video.user))
        .order_by(models.Video.created_at.desc())
        .all()
    )


def listar_por_usuario(base_datos: Session, user_id: int):
    return (
        base_datos.query(models.Video)
        .options(joinedload(models.Video.user))
        .filter(models.Video.user_id == user_id)
        .order_by(models.Video.created_at.desc())
        .all()
    )


def listar_recomendados(base_datos: Session, video_id: int, limite: int = 6):
    return (
        base_datos.query(models.Video)
        .options(joinedload(models.Video.user))
        .filter(models.Video.id != video_id)
        .order_by(models.Video.created_at.desc())
        .limit(limite)
        .all()
    )


def crear(base_datos: Session, datos):
    video = models.Video(**datos)
    base_datos.add(video)
    base_datos.commit()
    base_datos.refresh(video)
    return obtener_por_id(base_datos, video.id, cargar_usuario=True)


def actualizar(base_datos: Session, video, datos: dict):
    for campo, valor in datos.items():
        setattr(video, campo, valor)
    base_datos.commit()
    base_datos.refresh(video)
    return obtener_por_id(base_datos, video.id, cargar_usuario=True)


def incrementar_vistas(base_datos: Session, video_id: int):
    filas = (
        base_datos.query(models.Video)
        .filter(models.Video.id == video_id)
        .update({models.Video.views: models.Video.views + 1}, synchronize_session=False)
    )
    if filas == 0:
        return None
    base_datos.commit()
    return base_datos.query(models.Video.views).filter(models.Video.id == video_id).scalar()


def eliminar(base_datos: Session, video):
    base_datos.delete(video)
    base_datos.commit()
