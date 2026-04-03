FROM node:18-alpine

WORKDIR /app

# Instalar Chromium para whatsapp-web.js
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates

# Copiar package.json
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["node", "server.js"]
