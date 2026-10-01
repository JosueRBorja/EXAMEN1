import os
import unittest
from pathlib import Path


RUTA_BASE_PRUEBA = Path(__file__).parent / "videos_prueba.db"
os.environ["DATABASE_URL"] = f"sqlite:///{RUTA_BASE_PRUEBA.as_posix()}"
os.environ["STORAGE_DRIVER"] = "local"
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

from fastapi.testclient import TestClient

from app.application import app
from app.database import motor
from app.storage import CARPETA_VIDEOS


class FlujoLocalTest(unittest.TestCase):
    @classmethod
    def tearDownClass(cls):
        motor.dispose()
        if RUTA_BASE_PRUEBA.exists():
            RUTA_BASE_PRUEBA.unlink()

    def test_flujo_completo(self):
        with TestClient(app) as cliente:
            registro = cliente.post(
                "/users",
                json={
                    "name": "Usuario Prueba",
                    "email": "prueba@example.com",
                    "password": "123456",
                },
            )
            self.assertEqual(registro.status_code, 200, registro.text)
            usuario = registro.json()

            login = cliente.post(
                "/login",
                json={"email": "prueba@example.com", "password": "123456"},
            )
            self.assertEqual(login.status_code, 200)

            subida_movil = cliente.post(
                "/uploads/video",
                files={"archivo": ("video-movil.mov", b"video de prueba", "video/quicktime")},
            )
            self.assertEqual(subida_movil.status_code, 200, subida_movil.text)
            nombre_subido = subida_movil.json()["url"].rsplit("/", 1)[-1]
            self.assertTrue(nombre_subido.endswith(".mov"))
            (CARPETA_VIDEOS / nombre_subido).unlink(missing_ok=True)

            publicacion = cliente.post(
                "/videos",
                json={
                    "title": "Video de prueba",
                    "description": "Prueba de flujo local",
                    "video_url": "https://ejemplo.local/video.mp4",
                    "thumbnail_url": "https://ejemplo.local/miniatura.jpg",
                    "user_id": usuario["id"],
                },
            )
            self.assertEqual(publicacion.status_code, 200)
            video = publicacion.json()
            self.assertEqual(video["views"], 0)

            vista = cliente.post(f"/videos/{video['id']}/view")
            self.assertEqual(vista.status_code, 200)
            self.assertEqual(vista.json()["views"], 1)

            comentario = cliente.post(
                f"/videos/{video['id']}/comments",
                json={"content": "Comentario de prueba", "user_id": usuario["id"]},
            )
            self.assertEqual(comentario.status_code, 200)

            perfil = cliente.get(f"/users/{usuario['id']}/videos")
            self.assertEqual(perfil.status_code, 200)
            self.assertEqual(perfil.json()["total_videos"], 1)

            edicion = cliente.put(
                f"/users/{usuario['id']}",
                json={"name": "Usuario Editado"},
            )
            self.assertEqual(edicion.status_code, 200)
            self.assertEqual(edicion.json()["name"], "Usuario Editado")

            eliminacion = cliente.delete(f"/videos/{video['id']}")
            self.assertEqual(eliminacion.status_code, 200)
            self.assertEqual(cliente.get(f"/videos/{video['id']}").status_code, 404)


if __name__ == "__main__":
    unittest.main()
