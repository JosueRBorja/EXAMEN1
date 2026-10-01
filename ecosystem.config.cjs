const path = require("path");

const raiz = __dirname;

module.exports = {
  apps: [
    {
      name: "frame-api",
      cwd: path.join(raiz, "backend"),
      script: path.join(raiz, "backend", "iniciar.py"),
      interpreter: path.join(raiz, "backend", ".venv", "Scripts", "python.exe"),
      autorestart: false,
      windowsHide: true,
      watch: false,
      env: {
        PYTHONDONTWRITEBYTECODE: "1",
      },
    },
    {
      name: "frame-web",
      cwd: path.join(raiz, "frontend"),
      script: path.join(raiz, "frontend", "node_modules", "vite", "bin", "vite.js"),
      args: "--host 127.0.0.1 --port 5173",
      interpreter: "node",
      autorestart: false,
      windowsHide: true,
      watch: false,
    },
  ],
};
