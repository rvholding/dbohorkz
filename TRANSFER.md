# Checklist de Transferencia del Repositorio

Guía para transferir `dbohorkz` de `rvholding` a la cuenta personal del dueño sin romper deploys.

## Paso 0 — Preparación (ANTES de transferir)

### 0.1. Anotar credenciales y variables

**Cloudflare Pages — Environment Variables:**
- [ ] `REACT_APP_API_URL` = `https://dbohorkz-production.up.railway.app`
- [ ] Anotar **Custom domains** configurados: `dbohorkz.com`, `www.dbohorkz.com`
- [ ] Build command: `cd frontend && npm install && npm run build`
- [ ] Build output: `frontend/build`

**Railway — Backend service (Variables):**
- [ ] `DATABASE_URL` (PostgreSQL — Railway la auto-genera, anotar el valor)
- [ ] `SECRET_KEY`
- [ ] `JWT_SECRET_KEY` (CRÍTICO: si cambia, todos los tokens existentes se invalidan)
- [ ] `JWT_EXPIRATION_HOURS`
- [ ] `CORS_ORIGINS` (incluir `https://dbohorkz.com,https://www.dbohorkz.com,https://dbohorkz.pages.dev`)
- [ ] `ADMIN_USERNAME` = `admin`
- [ ] `RESEND_API_KEY`
- [ ] `MAIL_RECIPIENT`
- [ ] `CLOUDINARY_CLOUD_NAME` = `dktuithwk`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `UPLOAD_FOLDER` (si está set)

**Railway — WhatsApp service (Variables):**
- [ ] `FLASK_API_URL` = `https://dbohorkz-production.up.railway.app`
- [ ] `PORT` = 3001
- [ ] `NODE_ENV` = production
- [ ] `TYPING_DELAY`
- [ ] `PUPPETEER_EXECUTABLE_PATH` = `/usr/bin/chromium`

### 0.2. Backup de base de datos

Railway PostgreSQL — desde Railway dashboard:
- [ ] Ir al servicio Postgres → pestaña Data → Export / Backup
- [ ] Guardar el dump como `.sql` localmente

### 0.3. Commit y push de cambios pendientes

- [ ] `git status` — verificar que no haya cambios sin commitear
- [ ] `git push origin main`

---

## Paso 1 — Transferir el repo en GitHub

1. [ ] Login en GitHub como `rvholding` (o quien tenga permisos de admin del repo)
2. [ ] Ir a `https://github.com/rvholding/dbohorkz/settings`
3. [ ] Scroll hasta el final → sección **"Danger Zone"** → **"Transfer ownership"**
4. [ ] Escribir el nombre del nuevo dueño (su username de GitHub personal)
5. [ ] Confirmar escribiendo `rvholding/dbohorkz`
6. [ ] GitHub envía email de invitación al nuevo dueño
7. [ ] El nuevo dueño abre el email y acepta la transferencia
8. [ ] Verificar que el repo aparezca en `https://github.com/NUEVO_OWNER/dbohorkz`

> ℹ️ GitHub crea una redirección automática del URL viejo al nuevo, así que los webhooks y enlaces externos siguen funcionando temporalmente. Pero hay que actualizar todo.

---

## Paso 2 — Actualizar git remote local

En la máquina local:

```bash
cd c:\Users\Sofia\Documents\My\GitHub\dbohorkz
git remote set-url origin https://github.com/NUEVO_OWNER/dbohorkz.git
git remote -v   # verificar que el URL cambió
```

---

## Paso 3 — Reconectar Cloudflare Pages

Cloudflare Pages está conectado a GitHub vía OAuth de `rvholding`. Después de la transferencia:

### Opción A — El nuevo dueño se hace cargo de Cloudflare
1. [ ] El nuevo dueño crea su cuenta de Cloudflare (o usa existente)
2. [ ] En Cloudflare → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. [ ] Autorizar Cloudflare en su GitHub personal
4. [ ] Seleccionar el repo `dbohorkz` transferido
5. [ ] Configurar:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output: `frontend/build`
   - Variables: `REACT_APP_API_URL` (ver Paso 0.1)
6. [ ] Custom domains → agregar `dbohorkz.com` y `www.dbohorkz.com`
7. [ ] Eliminar el proyecto antiguo en la cuenta de Cloudflare original

### Opción B — Mantener Cloudflare en cuenta actual
1. [ ] En Cloudflare Pages → Settings → ver si el repo sigue conectado
2. [ ] Si dice "no access" → reautorizar GitHub en la cuenta actual de Cloudflare
3. [ ] El usuario debe ser colaborador del nuevo repo

---

## Paso 4 — Reconectar Railway (backend + WhatsApp)

### Opción A — Transferir a la cuenta del nuevo dueño
1. [ ] El nuevo dueño crea cuenta de Railway
2. [ ] **Backend service:**
   - Crear nuevo proyecto → Deploy from GitHub → seleccionar repo
   - Configurar root directory: `backend/`
   - Agregar TODAS las variables del Paso 0.1
   - Agregar PostgreSQL desde "Add service"
   - Importar el backup `.sql` (Paso 0.2)
3. [ ] **WhatsApp service:**
   - Mismo proceso, root directory: `whatsapp-service/`
   - Variables del Paso 0.1
4. [ ] Apuntar el dominio Railway nuevo → actualizar `REACT_APP_API_URL` en Cloudflare

### Opción B — Mantener Railway en cuenta actual
1. [ ] Verificar en Railway que la conexión a GitHub siga activa después de la transferencia
2. [ ] Si falla → reconectar el repo desde Railway

---

## Paso 5 — Verificación

Después de todo:

- [ ] `dbohorkz.com` carga la tienda
- [ ] Productos se ven (cargan desde Railway backend)
- [ ] `dbohorkz.com/admin` → login admin/admin123 funciona
- [ ] Pestañas Productos, Pedidos, Testimonios, Catálogo, Clientes funcionan
- [ ] `dbohorkz.com/cliente` → login de cliente preferencial funciona
- [ ] Hacer un pedido de prueba y verificar que llegue a admin
- [ ] WhatsApp service Online (verificar QR si es necesario)
- [ ] Email de Resend llega cuando se usa el chatbot

---

## Servicios que NO se afectan

- **Dominio dbohorkz.com** (GoDaddy + Cloudflare DNS) — independiente del repo
- **Cloudinary** — cuenta propia, no atada al repo
- **Resend** — cuenta propia, no atada al repo
- **GoDaddy** — dominio independiente

---

## Notas importantes

- ⚠️ **JWT_SECRET_KEY**: si cambia, todos los usuarios deben hacer login de nuevo. Mantener el mismo valor en la nueva cuenta.
- ⚠️ **PostgreSQL Backup**: Railway crea uno automático antes de eliminar el servicio, pero hacer el manual da más seguridad.
- ⚠️ **DNS de Cloudflare Pages**: si se cambia de cuenta Cloudflare, hay que reconfigurar los CNAME para el custom domain.
- ⚠️ **Cloudinary URLs**: los URLs de imágenes ya subidas siguen funcionando porque están guardadas en la DB con la URL completa de Cloudinary.
