const path = require("path");

const raiz = __dirname;

module.exports = {
  apps: [
    {
      name: "frame-api",
      cwd: path.join(raiz, "backend"),
      script: path.join(raiz, "backend", "iniciar.py"),
      interpreter: path.join(raiz, "backend", ".venv", "bin", "python"),
      autorestart: true,
      watch: false,
      env: {
        HOST: "0.0.0.0",
        PORT: "8000",
        PYTHONDONTWRITEBYTECODE: "1",
        PYTHONUNBUFFERED: "1",
      },
    },
  ],
};
