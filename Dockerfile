# syntax=docker/dockerfile:1
FROM node:18

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos solo package*.json primero para aprovechar cache de docker
COPY package*.json ./

# Instalamos las dependencias dentro del contenedor (Linux)
# Recomiendo `npm ci` en CI para instalaciones reproducibles cuando exista package-lock.json
RUN npm ci --production

# Si necesitas compilar módulos nativos desde la fuente (opcional)
# RUN npm ci --build-from-source

# Copiamos el resto del proyecto (sin node_modules porque lo ignoramos en .dockerignore)
COPY . .

# Expón puerto si aplica, por ejemplo 3000
EXPOSE 3000

# Comando por defecto
CMD ["node", "server.js"]
