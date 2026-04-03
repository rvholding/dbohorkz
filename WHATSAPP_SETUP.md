# 📱 Integración WhatsApp - Resumen de Cambios

## ✅ Lo que se ha hecho

### 1. **Creado Servicio WhatsApp (Node.js)**
   - 📁 `whatsapp-service/` - Nuevo directorio
   - 📄 `server.js` - Servidor principal con whatsapp-web.js
   - 📄 `package.json` - Dependencias Node.js
   - 📄 `.env.example` - Variables de entorno
   - 📄 `.gitignore` - Archivos ignorados
   - 📄 `README.md` - Documentación del servicio

### 2. **Actualizado Backend Flask**
   - ✏️ `app/routes/chatbot.py` - Agregado soporte a parámetro `platform`
   - ✏️ `app/models/chat_message.py` - Nuevo campo `platform` para diferenciar web/whatsapp
   - ✏️ `app/models/chat_message.py` - Actualizado método `to_dict()`

### 3. **Documentación Actualizada**
   - ✏️ `README.md` - Agregada sección de WhatsApp
   - ✏️ `docs/SETUP.md` - Guía completa de instalación con WhatsApp

### 4. **Estructura del Proyecto Completa**
```
dbohorkz/
├── backend/ (Flask + Python)
├── frontend/ (React)
├── whatsapp-service/ (Node.js + whatsapp-web.js) 🆕
└── docs/ (Documentación)
```

---

## 🚀 Los pasos para empezar

### Terminal 1: Backend Flask
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Terminal 2: Frontend React
```bash
cd frontend
npm install
npm start
```

### Terminal 3: WhatsApp Service
```bash
cd whatsapp-service
npm install
npm start
# Escanea el código QR que aparecerá
```

---

## 📝 Características del ChatBot

El chatbot responde automáticamente a mensajes de WhatsApp sobre:
- ✅ Saludos ("hola")
- ✅ Productos ("productos")
- ✅ Precios ("precio")
- ✅ Envíos ("envío")
- ✅ Métodos de pago ("pago")
- ✅ Devoluciones ("devolución")
- ✅ Contacto ("contacto")

---

## 🔗 Endpoints Disponibles

### Backend Flask
- `POST /api/chatbot/message` - Procesar mensajes
- `GET /api/chatbot/faq` - Obtener FAQs
- `GET /api/chatbot/history/<user_id>` - Historial

### WhatsApp Service
- `GET /api/health` - Estado de conexión
- `GET /api/info` - Info del servicio
- `POST /api/send-message` - Enviar mensaje manual

---

## 🔐 Tecnologías Utilizadas

**Backend:**
- Flask (Python)
- SQLAlchemy (ORM)
- CORS

**Frontend:**
- React
- Axios

**WhatsApp:**
- whatsapp-web.js (Node.js)
- Puppeteer (Chromium automation)
- Express.js

---

## ⚠️ Próximos pasos recomendados

1. **Personalizar respuestas** - Editar `backend/app/services/chatbot_service.py`
2. **Agregar base de datos** - Migrar a PostgreSQL si es necesario
3. **Mejorar IA** - Integrar OpenAI GPT o Google Gemini
4. **Agregar Media** - Soporte para imágenes/documentos en WhatsApp
5. **Deploy** - Desplegar en servidor de producción
6. **Testing** - Agregar tests unitarios

---

## 📚 Referencias

- [whatsapp-web.js Docs](https://docs.wwebjs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

¡Tu proyecto está listo para empezar! 🎉
