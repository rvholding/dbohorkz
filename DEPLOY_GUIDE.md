# 🚀 Guía de Deployment: Vercel + Railway

## Tabla de Contenidos
1. [Preparación](#preparación)
2. [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
3. [Deploy Backend + WhatsApp (Railway)](#deploy-backend--whatsapp-railway)
4. [Configurar Dominio](#configurar-dominio)
5. [Variables de Entorno](#variables-de-entorno)
6. [Troubleshooting](#troubleshooting)

---

## Preparación

### Requisitos
- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com) (conectada a GitHub)
- Cuenta en [Railway](https://railway.app) (conectada a GitHub)
- Acceso a tu hosting de dominio (GoDaddy, Namecheap, etc.)

### Pasos previos
1. **Sube todo a GitHub**:
```bash
cd C:\Users\Sofia\Documents\My\GitHub\dbohorkz
git init
git add .
git commit -m "Initial commit - ecommerce with WhatsApp"
git remote add origin https://github.com/TU_USUARIO/dbohorkz.git
git branch -M main
git push -u origin main
```

2. **Verifica la estructura**:
```
dbohorkz/
├── frontend/
├── backend/
├── whatsapp-service/
├── docs/
├── vercel.json          (lo crearemos)
├── backend/Dockerfile   (lo crearemos)
└── README.md
```

---

## Deploy Frontend (Vercel)

### Paso 1: Conectar GitHub a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New" → "Project"**
3. Selecciona **"Import Git Repository"**
4. Selecciona tu repo `dbohorkz`
5. Click **"Import"**

### Paso 2: Configurar Variables de Entorno

En Vercel dashboard del proyecto:
- Click en **"Settings" → "Environment Variables"**
- Agrega:

```
REACT_APP_API_URL = https://tu-backend.railway.app
REACT_APP_WHATSAPP_API = https://tu-whatsapp.railway.app
```

### Paso 3: Configurar Root Directory

En **"Settings" → "General"**:
- **Root Directory**: `frontend`

### Paso 4: Deploy

Click **"Deploy"** - Vercel compilará automáticamente.

**Tu frontend estará en**: `https://dbohorkz.vercel.app`

---

## Deploy Backend + WhatsApp (Railway)

### Opción A: Dos Servicios Separados (Recomendado)

#### Backend Flask:

1. Ve a [railway.app](https://railway.app)
2. Click **"New Project" → "Deploy from GitHub"**
3. Selecciona el repo `dbohorkz`
4. Configura:

**Root Directory**: `backend`

**Environment Variables** (Click "Add Variable"):
```
FLASK_ENV=production
DATABASE_URL=sqlite:///ecommerce.db
FRONTEND_URL=https://dbohorkz.vercel.app
```

5. Click **"Deploy"**

---

#### WhatsApp Service:

1. En el mismo proyecto Railway, click **"New" → "Service" → "GitHub"**
2. Selecciona el mismo repo
3. Configura:

**Root Directory**: `whatsapp-service`

**Environment Variables**:
```
PORT=3001
FLASK_API_URL=https://tu-backend.railway.app
NODE_ENV=production
BOT_NAME=Sofia Bot
AUTO_REPLY_ENABLED=true
TYPING_DELAY=1000
```

4. Click **"Deploy"**

---

### Opción B: Un Solo Servicio con Docker Compose

(Alternativa más avanzada - ver sección Docker)

---

## Configurar Dominio

### Paso 1: Comprar Dominio

En GoDaddy/Namecheap:
1. Busca `dbohorkz.com`
2. Compra por 1 año (~$10)
3. Nota los **nameservers** que te proporcionen

### Paso 2: Conectar a Vercel

En **Vercel Dashboard → Project Settings → Domains**:

1. Click **"Add Domain"**
2. Ingresa `dbohorkz.com`
3. Selecciona **"Nameserver"** (opción recomendada)
4. Vercel te mostrará 4 nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

### Paso 3: Actualizar Nameservers en GoDaddy

1. En GoDaddy, ve a tu dominio
2. **Gestionar DNS → Nameservers → Cambiar**
3. Reemplaza con los de Vercel
4. Guarda

⏳ Espera 24-48 horas para que se propague

### Paso 4: Añadir Subdominios (Opcional)

Para tener URLs distintas:

En Vercel:
- `api.dbohorkz.com` → Backend Railway
- `whatsapp.dbohorkz.com` → WhatsApp Railway

En Railway, cada servicio te dará una URL pública que puedes usar.

---

## Variables de Entorno

### Frontend (Vercel)

```
REACT_APP_API_URL=https://api.dbohorkz.com
REACT_APP_WHATSAPP_API=https://whatsapp.dbohorkz.com
REACT_APP_ENV=production
```

### Backend (Railway)

```
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@host/dbohorkz
SECRET_KEY=generaUnaClaveSeguraAqui
FRONTEND_URL=https://dbohorkz.com
CORS_ORIGINS=https://dbohorkz.com,https://www.dbohorkz.com
```

### WhatsApp Service (Railway)

```
PORT=3001
FLASK_API_URL=https://api.dbohorkz.com
NODE_ENV=production
BOT_NAME=Sofia Bot
AUTO_REPLY_ENABLED=true
TYPING_DELAY=1000
```

---

## URLs en Producción

Una vez deployado:

```
Frontend:      https://dbohorkz.com
Backend API:   https://api.dbohorkz.com/api/
WhatsApp API:  https://whatsapp.dbohorkz.com/api/
```

### Test:

```bash
# Health check backend
curl https://api.dbohorkz.com/api/chatbot/faq

# Health check WhatsApp
curl https://whatsapp.dbohorkz.com/api/health
```

---

## Migración Futura a Pagado

### Cuando necesites más recursos:

1. **DigitalOcean Droplet** ($5-6/mes)
   - Migra Backend + WhatsApp a un VPS
   - Mantén Frontend en Vercel (gratis)

2. **Pasos**:
   - Obtén IP del Droplet
   - Apunta tu dominio a esa IP
   - SSH y corre los servicios con Docker
   - código no cambia, solo la URL

### Docker para DigitalOcean

```bash
# En el servidor
docker-compose up -d
```

(Incluiremos `docker-compose.yml` en el siguiente paso)

---

## Troubleshooting

### Error: "Frontend no ve el Backend"
- Verifica CORS en `backend/app/config.py`
- Asegúrate que `FRONTEND_URL` está correcto
- Prueba manualmente: `curl https://api.dbohorkz.com/api/health`

### Error: "Vercel no encuentra el archivo"
- Verifica que `vercel.json` está correcto
- Root Directory debe ser `frontend`

### Error: "WhatsApp desconectado"
- Verifica que `.wwebjs_auth/` no está en `.gitignore`
- O necesitarás re-escanear QR

### Error: "Base de datos vacía en producción"
- Railway crea volumen automático
- Verifica `DATABASE_URL` en Railway

---

## Checklist Final

- [ ] Repo en GitHub
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway
- [ ] WhatsApp Service deployado en Railway
- [ ] Variables de entorno configuradas
- [ ] Dominio comprado
- [ ] Nameservers actualizados
- [ ] URLs funcionando
- [ ] QR de WhatsApp escaneado en producción
- [ ] Tests realizados

---

## Próximos Pasos

1. **Monitoreo**: Configura alertas en Railway
2. **SSL/HTTPS**: Vercel y Railway lo hacen automático
3. **Backups**: Configura backups automáticos de BD
4. **Análitics**: Agrega Google Analytics
5. **CI/CD**: Configura tests automáticos

---

## Soporte

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Flask sobre Vercel: https://vercel.com/guides/deploying-flask

¡Tu proyecto está listo para producción! 🚀
