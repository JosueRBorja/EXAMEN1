import hashlib
import secrets


def _crear_hash(contrasena: str, sal: str) -> str:
    contrasena_bytes = contrasena.encode("utf-8")
    sal_bytes = sal.encode("utf-8")
    hash_creado = hashlib.pbkdf2_hmac(
        "sha256", contrasena_bytes, sal_bytes, 100000
    )
    return hash_creado.hex()


def crear_hash_contrasena(contrasena: str) -> str:
    sal = secrets.token_hex(16)
    hash_creado = _crear_hash(contrasena, sal)
    return f"{sal}:{hash_creado}"


def verificar_contrasena(contrasena: str, hash_contrasena: str) -> bool:
    sal, hash_guardado = hash_contrasena.split(":")
    return secrets.compare_digest(
        _crear_hash(contrasena, sal), hash_guardado
    )
