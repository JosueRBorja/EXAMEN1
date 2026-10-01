from sqlalchemy.orm import Session

from .. import models


def obtener_por_id(base_datos: Session, user_id: int):
    return base_datos.query(models.User).filter(models.User.id == user_id).first()


def obtener_por_correo(base_datos: Session, correo: str):
    return base_datos.query(models.User).filter(models.User.email == correo).first()


def crear(base_datos: Session, nombre: str, correo: str, password_hash: str):
    usuario = models.User(name=nombre, email=correo, password_hash=password_hash)
    base_datos.add(usuario)
    base_datos.commit()
    base_datos.refresh(usuario)
    return usuario


def actualizar(base_datos: Session, usuario, datos: dict):
    for campo, valor in datos.items():
        setattr(usuario, campo, valor)
    base_datos.commit()
    base_datos.refresh(usuario)
    return usuario
