# ⚡ Quick Start: Deploy en 15 Minutos

## 📋 Pre-requisitos (5 min)

- [ ] Cuenta GitHub (https://github.com)
- [ ] Cuenta Vercel (https://vercel.com) - conectada a GitHub
- [ ] Cuenta Railway (https://railway.app) - conectada a GitHub
- [ ] Dominio comprado (GoDaddy, Namecheap, etc.)

---

## 🚀 Paso 1: Subir a GitHub (2 min)

```bash
cd C:\Users\Sofia\Documents\My\GitHub\dbohorkz

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/dbohorkz.git
git branch -M main
git push -u origin main
```

---

## 🎨 Paso 2: Frontend en Vercel (3 min)

1. Ve a [vercel.com](https://vercel.com)
2. Click **"Add New" → "Project"**
3. Click **"Import Git Repository"**
4. Selecciona **"dbohorkz"**
5. Configure:
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=https://backend-railway-url.railway.app
     REACT_APP_WHATSAPP_API=https://whatsapp-railway-url.railway.app
     ```
6. Click **"Deploy"** ✅

**Tu frontend estará en**: `https://dbohorkz.vercel.app` (gratis)

---

## ⚙️ Paso 3: Backend en Railway (3 min)

### 3.1 Servicio Backend

1. Ve a [railway.app](https://railway.app)
2. Click **"New Project" → "Deploy from GitHub"**
3. Selecciona **"dbohorkz"**
4. Configure:
   - **Root Directory**: `backend`
   - **Environment Variables**:
     ```
     FLASK_ENV=production
     DATABASE_URL=sqlite:///ecommerce.db
     FRONTEND_URL=https://dbohorkz.vercel.app
     ```
5. Click **"Deploy"** ✅

**URL Backend**: Railway te mostrará una URL como `https://xxxx-production.railway.app`

### 3.2 Servicio WhatsApp

1. En el mismo proyecto Railway, click **"New Service"**
2. Click **"Deploy from GitHub"**
3. Selecciona **"dbohorkz"** (mismo repo)
4. Configure:
   - **Root Directory**: `whatsapp-service`
   - **Environment Variables**:
     ```
     PORT=3001
     FLASK_API_URL=https://tu-backend-railway-url.railway.app
     NODE_ENV=production
     BOT_NAME=Sofia Bot
     ```
5. Click **"Deploy"** ✅

**URL WhatsApp**: Railway te mostrará una URL

---

## 🌐 Paso 4: Conectar Dominio (2 min)

### En tu Registrador de Dominios (GoDaddy, Namecheap):

1. Accede a tu cuenta
2. Busca **"Gestionar DNS"** o **"Nameservers"**
3. **Copia estos nameservers de Vercel**: (los obtuviste en Vercel Dashboard)
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
4. **Reemplaza los nameservers actuales** con los de Vercel
5. Guarda los cambios

⏳ **Espera 24-48 horas** para que se propague

---

## ✅ Verificación Final (2 min)

```bash
# Test Frontend
https://dbohorkz.com (después de 24-48h)

# Test Backend
https://backend-url.railway.app/api/chatbot/faq

# Test WhatsApp
https://whatsapp-url.railway.app/api/health
```

---

## 🎯 URLs en Producción

Una vez todo conectado:

```
🌐 Frontend:    https://dbohorkz.com
⚙️  Backend API:   https://api.railway.app/  (o tu URL)
📱 WhatsApp API: https://whatsapp.railway.app/ (o tu URL)
```

---

## 📱 Conectar WhatsApp

Después del deployment:

1. En Railway → tu servicio WhatsApp → "Logs"
2. Busca el **código QR** en verde
3. Abre WhatsApp en tu teléfono
4. **Dispositivos vinculados → Vincular dispositivo**
5. Escanea el QR

¡Listo! El chatbot estará activo 🤖

---

## 🛑 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Frontend muestra error 404 | Vercel necesita `vercel.json` correcto |
| Backend no responde | Verifica variables de entorno en Railway |
| WhatsApp offline | Re-escanea QR en los logs de Railway |
| Dominio no redirige | Espera más tiempo a que se propague (24-48h) |

---

## 🚀 Próximos Pasos

1. **Personalizar**: Edita respuestas del bot en `backend/app/services/chatbot_service.py`
2. **Mejorar**: Agrega IA (OpenAI, Gemini)
3. **Escalar**: Si necesitas más, migrate a DigitalOcean ($5/mes)
4. **Monitor**: Configura alertas en Railway

---

## 💰 Costos

- **Vercel Frontend**: $0 (gratis)
- **Railway Backend**: $0-5/mes (gratis para inicio)
- **Dominio**: ~$10/año
- **Total**: ~$10/año de inicio

---

## 📚 Documentación Completa

- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Guía detallada
- [RAILWAY_SETUP.md](RAILWAY_SETUP.md) - Específica para Railway
- [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) - Configuración WhatsApp

---

¡Felicidades! Tu aplicación está en línea 🎉
