FROM --platform=linux/arm64 node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Crear directorio para logs
RUN mkdir -p logs

COPY . .

ENV NODE_ENV=docker
EXPOSE 8000

CMD ["npm", "start"]