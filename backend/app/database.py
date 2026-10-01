import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()

URL_BASE_DATOS = os.getenv("DATABASE_URL", "sqlite:///./videos.db")

argumentos_conexion = {}
if URL_BASE_DATOS.startswith("sqlite"):
    argumentos_conexion = {"check_same_thread": False}

motor = create_engine(URL_BASE_DATOS, connect_args=argumentos_conexion)
SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)

Base = declarative_base()


def aplicar_migraciones_basicas():
    inspector = inspect(motor)
    if "users" not in inspector.get_table_names():
        return

    columnas = {columna["name"] for columna in inspector.get_columns("users")}
    if "avatar_url" not in columnas:
        with motor.begin() as conexion:
            conexion.execute(
                text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500)")
            )


def obtener_base_datos():
    base_datos = SesionLocal()
    try:
        yield base_datos
    finally:
        base_datos.close()
