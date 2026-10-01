from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import obtener_base_datos
from ..services import usuarios_service


router = APIRouter(tags=["Usuarios"])


@router.post("/users", response_model=schemas.UserResponse)
def crear_usuario(datos_usuario: schemas.UserCreate, base_datos: Session = Depends(obtener_base_datos)):
    return usuarios_service.crear_usuario(base_datos, datos_usuario)


@router.post("/login", response_model=schemas.LoginResponse)
def iniciar_sesion(datos_login: schemas.UserLogin, base_datos: Session = Depends(obtener_base_datos)):
    usuario = usuarios_service.iniciar_sesion(base_datos, datos_login)
    return {"message": "Login correcto", "user": usuario}


@router.get("/users/{user_id}", response_model=schemas.UserResponse)
def obtener_usuario(user_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return usuarios_service.obtener_usuario(base_datos, user_id)


@router.put("/users/{user_id}", response_model=schemas.UserResponse)
def actualizar_usuario(user_id: int, datos_usuario: schemas.UserUpdate, base_datos: Session = Depends(obtener_base_datos)):
    return usuarios_service.actualizar_usuario(base_datos, user_id, datos_usuario)


@router.get("/users/{user_id}/videos", response_model=schemas.UserProfileResponse)
def obtener_videos_usuario(user_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return usuarios_service.obtener_perfil(base_datos, user_id)
