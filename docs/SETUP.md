# 📖 Guía de Instalación y Configuración

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Python 3.8+**: [Descargar Python](https://www.python.org/downloads/)
- **Node.js 14+**: [Descargar Node.js](https://nodejs.org/)
- **Git**: [Descargar Git](https://git-scm.com/)

Verifica que están instalados correctamente:

```bash
python --version
node --version
npm --version
```

---

## 1️⃣ Configuración del Backend (Flask)

### Paso 1: Navega a la carpeta backend

```bash
cd backend
```

### Paso 2: Crea un entorno virtual

```bash
# En Windows
python -m venv venv

# En macOS/Linux
python3 -m venv venv
```

### Paso 3: Activa el entorno virtual

```bash
# En Windows
venv\Scripts\activate

# En macOS/Linux
source venv/bin/activate
```

### Paso 4: Instala las dependencias

```bash
pip install -r requirements.txt
```

### Paso 5: Configura las variables de entorno

Copia el archivo `.env.example` a `.env` y configúralo:

```bash
cp .env.example .env
```

Edita `.env` con tus valores (puedes dejar los valores por defecto para empezar).

### Paso 6: Inicia el servidor

```bash
python run.py
```

El servidor estará disponible en: **http://localhost:5000**

Verifica que funciona:
```bash
curl http://localhost:5000/api/products
```

---

## 2️⃣ Configuración del Frontend (React)

### Paso 1: Navega a la carpeta frontend

```bash
cd frontend
```

### Paso 2: Instala las dependencias

```bash
npm install
```

### Paso 3: Crea un archivo .env (opcional)

```bash
echo REACT_APP_API_URL=http://localhost:5000 > .env
```

### Paso 4: Inicia la aplicación

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:3000**

---

## 3️⃣ Estructura de Carpetas Explicada

### Backend

```
backend/
├── app/
│   ├── __init__.py              # Configuración de la app
│   ├── config.py                # Configuración global
│   ├── models/
│   │   ├── user.py              # Modelo de usuario
│   │   ├── product.py           # Modelo de producto
│   │   └── chat_message.py      # Modelo de mensajes
│   ├── routes/
│   │   ├── auth.py              # Rutas de autenticación
│   │   ├── products.py          # Rutas de productos
│   │   └── chatbot.py           # Rutas del chatbot
│   └── services/
│       └── chatbot_service.py   # Lógica del chatbot
├── run.py                        # Punto de entrada
├── requirements.txt              # Dependencias Python
└── .env.example                  # Variables de ejemplo
```

### Frontend

```
frontend/
├── src/
│   ├── components/               # Componentes React
│   ├── pages/                    # Páginas principales
│   ├── services/                 # Servicios API
│   ├── App.js                    # Componente principal
│   └── index.js                  # Punto de entrada
├── public/
│   └── index.html                # HTML principal
└── package.json                  # Dependencias Node
```

---

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/<id>` - Obtener un producto
- `POST /api/products` - Crear producto
- `PUT /api/products/<id>` - Actualizar producto
- `DELETE /api/products/<id>` - Eliminar producto

### Chatbot
- `POST /api/chatbot/message` - Enviar mensaje al chat
- `GET /api/chatbot/faq` - Obtener FAQs
- `GET /api/chatbot/history/<user_id>` - Historial del chat

---

## 3️⃣ Configuración del WhatsApp Service (Nuevo)

### Requisitos adicionales
- Chrome/Chromium instalado
- Node.js 16+ (ya debería estar instalado)

### Paso 1: Navega a la carpeta whatsapp-service

```bash
cd whatsapp-service
```

### Paso 2: Instala las dependencias

```bash
npm install
```

### Paso 3: Crea un archivo .env

```bash
copy .env.example .env
```

Edita `.env` con tus valores:

```env
PORT=3001
FLASK_API_URL=http://localhost:5000
NODE_ENV=development
BOT_NAME=Sofia Bot
AUTO_REPLY_ENABLED=true
TYPING_DELAY=1000
```

### Paso 4: Inicia el servicio

```bash
npm start
```

El servicio estará disponible en: **http://localhost:3001**

### Paso 5: Conectar WhatsApp

1. Aparecerá un código QR en la terminal (en caracteres ASCII)
2. Abre WhatsApp en tu teléfono
3. Toca **Dispositivos vinculados** → **Vincular un dispositivo**
4. **Escanea el código QR** con tu cámara
5. El chatbot se conectará automáticamente

### Paso 6: Prueba el chatbot

Envía un mensaje desde WhatsApp:
- "hola" → Recibiras una respuesta automática
- "productos" → Info del catálogo
- "contacto" → Info de contacto

---

## 🧪 Test Completo del Sistema

### 1. Verificar que todos los servicios están activos

**Backend:**
```bash
curl http://localhost:5000/api/chatbot/faq
```

**Frontend (en navegador):**
```
http://localhost:3000
```

**WhatsApp Service:**
```bash
curl http://localhost:3001/api/info
```

### 2. Enviar mensaje de Web a Chatbot

Abre `http://localhost:3000` y envía un mensaje desde la interfaz web.

### 3. Enviar mensaje desde WhatsApp

Escribe un mensaje en WhatsApp. El bot debe responder automáticamente.

### 4. Verificar historial

```bash
curl http://localhost:5000/api/chatbot/history/549XXXXXXXXXX
```

---

## 📋 Estructura Completa del Proyecto

```
dbohorkz/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── __init__.py
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── whatsapp-service/         # 🆕 NUEVO
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── docs/
│   └── SETUP.md
└── README.md
```

---

## 🐛 Troubleshooting

### Error: "pip not found"
Asegúrate de tener Python instalado y que está en tu PATH.

### Error: "npm not found"
Asegúrate de tener Node.js instalado correctamente.

### Error de CORS
Verifica que las URLs en `.env` son correctas en `CORS_ORIGINS`.

### Base de datos corrupta
Elimina el archivo `ecommerce.db` y reinicia el servidor para recrearla.

### WhatsApp: "QR Code not displayed"
- Verifica que la terminal soporta caracteres Unicode
- Intenta usar Windows PowerShell en lugar de cmd
- Reinicia el servicio

### WhatsApp: "Cannot find Chromium"
```bash
npm install --save-dev puppeteer
```

### WhatsApp: "Client is not ready"
- Asegúrate de haber escaneado el código QR correctamente
- Verifica que WhatsApp Web está permitido
- Reinicia el servicio

---

## 🚀 Próximos Pasos

1. **Frontend**: Crear paginas de login, productos y chatbot
2. **Carrito**: Implementar sistema de carrito
3. **Pagos**: Integrar pasarela de pagos
4. **IA**: Integrar ChatGPT o Gemini para respuestas inteligentes
5. **Tests**: Agregar pruebas unitarias
6. **WhatsApp Avanzado**: Agregar buttons, imagenes y documentos en WhatsApp
7. **Deploy**: Desplegar en servidores de producción

¡Feliz codificación! 🎉

