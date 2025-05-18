FROM node:16-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponer el puerto 8003
EXPOSE 8003

# Inicializar la base de datos y ejecutar el servidor
CMD ["sh", "-c", "node scripts/init-db.js && npm start"]