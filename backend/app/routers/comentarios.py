from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import obtener_base_datos
from ..services import comentarios_service


router = APIRouter(prefix="/videos/{video_id}/comments", tags=["Comentarios"])


@router.post("", response_model=schemas.CommentResponse)
def crear_comentario(video_id: int, datos_comentario: schemas.CommentCreate, base_datos: Session = Depends(obtener_base_datos)):
    return comentarios_service.crear_comentario(base_datos, video_id, datos_comentario)


@router.get("", response_model=list[schemas.CommentResponse])
def obtener_comentarios(video_id: int, base_datos: Session = Depends(obtener_base_datos)):
    return comentarios_service.obtener_comentarios(base_datos, video_id)
