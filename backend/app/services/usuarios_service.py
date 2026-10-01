from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import crear_hash_contrasena, verificar_contrasena
from ..repositories import usuarios_repository, videos_repository
from ..storage import eliminar_archivo


def crear_usuario(base_datos: Session, datos: schemas.UserCreate):
    if usuarios_repository.obtener_por_correo(base_datos, datos.email):
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")
    return usuarios_repository.crear(
        base_datos,
        datos.name.strip(),
        datos.email,
        crear_hash_contrasena(datos.password),
    )


def iniciar_sesion(base_datos: Session, datos: schemas.UserLogin):
    usuario = usuarios_repository.obtener_por_correo(base_datos, datos.email)
    if not usuario or not verificar_contrasena(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Correo o contrasena incorrectos")
    return usuario


def obtener_usuario(base_datos: Session, user_id: int):
    usuario = usuarios_repository.obtener_por_id(base_datos, user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


def actualizar_usuario(base_datos: Session, user_id: int, datos: schemas.UserUpdate):
    usuario = obtener_usuario(base_datos, user_id)
    cambios = datos.model_dump(exclude_unset=True)
    nuevo_correo = cambios.get("email")
    if nuevo_correo and nuevo_correo != usuario.email:
        if usuarios_repository.obtener_por_correo(base_datos, nuevo_correo):
            raise HTTPException(status_code=400, detail="El correo ya esta registrado")
    if "name" in cambios:
        cambios["name"] = cambios["name"].strip()
        if not cambios["name"]:
            raise HTTPException(status_code=400, detail="El nombre no puede estar vacio")
    avatar_anterior = usuario.avatar_url
    usuario = usuarios_repository.actualizar(base_datos, usuario, cambios)
    if cambios.get("avatar_url") != avatar_anterior and avatar_anterior:
        eliminar_archivo(avatar_anterior)
    return usuario


def obtener_perfil(base_datos: Session, user_id: int):
    usuario = obtener_usuario(base_datos, user_id)
    videos = videos_repository.listar_por_usuario(base_datos, user_id)
    return {"user": usuario, "total_videos": len(videos), "videos": videos}
