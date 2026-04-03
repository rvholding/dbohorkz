# WhatsApp Chatbot Service Installation & Setup

## 📋 Requisitos
- Node.js 16+ 
- npm o yarn
- Chrome/Chromium instalado (para whatsapp-web.js)
- Servidor Flask corriendo en `http://localhost:5000`

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd whatsapp-service
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
PORT=3001
FLASK_API_URL=http://localhost:5000
NODE_ENV=development
BOT_NAME=Sofia Bot
AUTO_REPLY_ENABLED=true
TYPING_DELAY=1000
```

### 3. Iniciar el servicio

```bash
npm start
```

O en modo desarrollo con hot-reload:

```bash
npm run dev
```

## 📱 Primer uso

1. **Ejecutar el servidor**:
   ```bash
   npm start
   ```

2. **Escanear código QR**:
   - Se mostrará un código QR en la terminal
   - Escanea con tu teléfono (WhatsApp → Dispositivos vinculados)
   - El bot se conectará automáticamente

3. **Enviar mensaje de prueba**:
   - Escribe a tu número de WhatsApp desde otro contacto
   - El chatbot responderá automáticamente

## 🔌 API REST Endpoints

### Health Check
```bash
GET http://localhost:3001/api/health
```

Respuesta:
```json
{
  "status": "connected",
  "timestamp": "2024-03-27T10:30:00.000Z"
}
```

### Info
```bash
GET http://localhost:3001/api/info
```

### Enviar mensaje
```bash
POST http://localhost:3001/api/send-message
Content-Type: application/json

{
  "phone": "549XXXXXXXXXX",
  "message": "Hola, esto es un mensaje de prueba"
}
```

Respuesta:
```json
{
  "success": true,
  "phone": "549XXXXXXXXXX",
  "message": "Hola...",
  "sent_at": "2024-03-27T10:30:00.000Z"
}
```

## 🗂️ Estructura

```
whatsapp-service/
├── server.js           # Servidor principal
├── package.json        # Dependencias
├── .env.example        # Configuración ejemplo
├── .env               # Configuración privada (NO committed)
├── .wwebjs_auth/      # Sesión de autenticación (auto-generado)
└── .gitignore         # Archivos ignorados
```

## 🔐 Notas de seguridad

- **Nunca** commits `.env` a Git
- **Nunca** commits la carpeta `.wwebjs_auth/` 
- Los tokens de sesión se almacenan localmente y son privados
- El bot requiere estar conectado a WhatsApp Web

## 🚨 Troubleshooting

### "Cannot find Chromium"
```bash
npm install --save-dev puppeteer
```

### "QR Code not displayed"
- Verifica que la terminal soporta caracteres Unicode
- Intenta escanear desde `http://localhost:3001/api/health`

### "Cliente no está conectado"
- Asegúrate de escanear el código QR completo
- Verifica que WhatsApp Web está permitido en tu navegador
- Reinicia el servicio

## 📝 Logs

El servicio registra:
- Conexión/desconexión
- Mensajes recibidos
- Respuestas enviadas
- Errores de comunicación con Flask

## 🔄 Integración con Flask

El servicio se conecta automáticamente con Flask en:
```
POST http://localhost:5000/api/chatbot/message
```

Con payload:
```json
{
  "message": "Tu mensaje",
  "user_id": "549XXXXXXXXXX",
  "platform": "whatsapp"
}
```

## 🛑 Detener el servicio

Presiona `Ctrl+C` para detener. El bot se desconectará automáticamente.
