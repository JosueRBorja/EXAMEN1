import os

import uvicorn


if __name__ == "__main__":
    servidor = os.getenv("HOST", "127.0.0.1")
    puerto = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.application:app", host=servidor, port=puerto)
