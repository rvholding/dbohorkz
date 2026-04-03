# 🚀 Instrucciones para Deployment en Railway

## Opción 1: Dos Servicios Separados (Recomendado)

### 1.1 Deploy Backend Flask

```bash
# En Railway Dashboard:
# 1. Click "New Project"
# 2. "Deploy from GitHub"
# 3. Selecciona tu repo "dbohorkz"
# 4. Selecciona "Backend" como Root Directory

# Variables de Entorno a agregar:
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:password@host/dbohorkz
FRONTEND_URL=https://dbohorkz.com
SECRET_KEY=tu-clave-secreta-super-larga
CORS_ORIGINS=https://dbohorkz.com,https://www.dbohorkz.com
```

Tu Backend estará en: `https://<railway-generated-url>.railway.app`

### 1.2 Deploy WhatsApp Service

```bash
# En el mismo Railway Project:
# 1. Click "Add Service" → "GitHub"
# 2. Selecciona "WhatsApp Service" como Root Directory
# 3. Configura variables:

PORT=3001
FLASK_API_URL=https://<backend-url>.railway.app
NODE_ENV=production
BOT_NAME=Sofia Bot
AUTO_REPLY_ENABLED=true
TYPING_DELAY=1000
```

Tu WhatsApp Service estará en: `https://<railway-generated-url>.railway.app`

---

## Opción 2: Con Docker Compose (Un Solo Comando)

```bash
# En tu máquina local o servidor:
docker-compose up -d

# Verifica que todo está corriendo:
docker-compose ps

# Ver logs:
docker-compose logs -f

# Detener:
docker-compose down
```

---

## Configurar Base de Datos en Railway

### Para PostgreSQL (Recomendado en Producción):

1. En Railway Dashboard → "New" → "Database" → "PostgreSQL"
2. Railway generará automáticamente: `DATABASE_URL`
3. Copia el `DATABASE_URL` en las variables de entorno del Backend

### Para SQLite (Simple, para empezar):

1. No necesitas hacer nada, Railway crea un volumen automático
2. Los datos persisten en el volumen de Railway

---

## Monitoreo en Railway

### Healthcheck configurado:

Backend tiene un endpoint `/api/health` que Railway monitorea automáticamente.

### Ver Logs en Tiempo Real:

```bash
# En Railway Dashboard → tu servicio → Logs
# O usa Railway CLI:
railway logs backend
railway logs whatsapp-service
```

---

## Variables de Entorno Seguras

Para colocar valores sensibles:

1. En Railway Dashboard → tu servicio → "Variables"
2. Click "Add Variable"
3. NO commitees `.env` a GitHub
4. Railway maneja las variables de forma segura

**Ejemplo:**
```
DATABASE_URL (generada automáticamente por Railway)
SECRET_KEY (genérala con Python: python -c "import secrets; print(secrets.token_hex(32))")
API_KEY (cualquier clave puedes generar)
```

---

## Conectar Dominio en Railway

### Después de comprar el dominio (ejemplo: dbohorkz.com):

1. En Railway → tu deploy del Frontend
2. "Settings" → "Custom Domain"
3. Ingresa `dbohorkz.com`
4. Railway te dará DNS records a agregar en GoDaddy

### Para Subdominios (Backend):

1. En Railway → tu deploy del Backend
2. "Settings" → "Custom Domain"
3. Ingresa `api.dbohorkz.com`
4. Agrega los DNS records en GoDaddy

---

## Escalar en el Futuro

Si necesitas más recursos:

1. **Railway** ofrece planes pagos ($5-50/mes)
2. O migra a **DigitalOcean Droplet** ($4-48/mes)
3. El código NO cambia, solo actualiza las URLs

### Migración a DigitalOcean:

```bash
# 1. SSH a tu Droplet
ssh root@tu_droplet_ip

# 2. Instala Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Sube tu código y corre:
git clone https://github.com/tu-usuario/dbohorkz.git
cd dbohorkz
docker-compose up -d
```

---

## Troubleshooting Railway

### Error: "Build Failed"
- Verifica `Dockerfile` está en la raíz del directorio
- Verifica `package.json` o `requirements.txt` existen
- Ve a "Logs" en Railway para más detalles

### Error: "Service Crashes"
- Verifica variables de entorno están configuradas
- Revisa logs: Railway → "Logs"
- Asegúrate que los puertos están correctos

### Error: "Cannot connect to Backend"
- Verifica `FLASK_API_URL` apunta a la URL correcta de Railway
- Abre la URL en el navegador para confirmar que funciona

### Error: "WhatsApp desconectado"
- Verifica que el volumen `.wwebjs_auth/` persiste en Railway
- Re-escanea el código QR
- Verifica `FLASK_API_URL` es correca

---

## Backups Automáticos

### Base de datos PostgreSQL:
Railway automáticamente hace backups diarios.

### Código:
Está en GitHub, siempre respaldado.

### Archivos de WhatsApp (.wwebjs_auth):
Almacenados en volumen de Railway, persistente automáticamente.

---

## Monitoring & Alerts

En Railway puedes configurar:
- Email alerts si el servidor cae
- Métricas de CPU, RAM, tráfico
- Logs en tiempo real

¡Tu aplicación está lista para producción! 🚀
