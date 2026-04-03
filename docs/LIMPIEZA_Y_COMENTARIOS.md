# Limpieza de código y documentación interna
**Fecha:** 2026-04-03

---

## Archivos eliminados

| Archivo | Razón |
|---|---|
| `backend/migrate_add_columns.py` | Script de migración one-time ya ejecutado. Las columnas `codigo` y `categoria` ya están en el modelo y en la BD. |
| `backend/seed_all.py` | Duplicado de `seed_productos.py` en la raíz del proyecto. |
| `657310495_881875588185994_4610448324426737225_n.jpg` | Imagen suelta en la raíz del proyecto, no pertenece al código. |
| `instance/ecommerce.db` | Base de datos SQLite vacía (0 bytes). La BD real vive en `backend/instance/`. |

---

## Archivos comentados

### Backend (Python / Flask)

| Archivo | Qué se documentó |
|---|---|
| `backend/app/__init__.py` | Factory pattern, orden de inicialización de extensiones, registro de blueprints |
| `backend/app/config.py` | Cada bloque de configuración (BD, seguridad, CORS, uploads, correo, APIs) y por qué existe |
| `backend/app/auth_middleware.py` | Flujo completo del JWT paso a paso: lectura del header, decodificación, verificación en BD |
| `backend/app/models/product.py` | Campos del modelo y propósito de cada columna (`codigo`, `categoria`, `image_url`) |
| `backend/app/routes/products.py` | Cada ruta HTTP, validaciones de entrada, separación entre rutas públicas y protegidas por admin, validación de imágenes por magic bytes |
| `backend/app/routes/chatbot.py` | Flujo del mensaje (FAQ → BD → correo opcional), historial paginado, restricción por usuario |

### Frontend (React / JavaScript)

| Archivo | Qué se documentó |
|---|---|
| `frontend/src/services/api.js` | Interceptor JWT, grupos de endpoints (productos, auth, chatbot) |
| `frontend/src/pages/Home.jsx` | Orden de las secciones de la página y rol del `WhatsAppButton` |
| `frontend/src/components/ProductsSection.jsx` | Filtrado por categoría, cálculo de conteos por badge, estados de UI (carga, error, vacío) |
| `frontend/src/components/ProductCard.jsx` | Cada sección visual: imagen con placeholder, código auto-generado, badge de categoría, precio, stock, botón |

---

## Estado del proyecto tras la limpieza

- Sin archivos huérfanos ni scripts de un solo uso
- Sin código comentado innecesario
- Sin imports sin usar
- Sin `console.log` innecesarios
- Comentarios en español, alineados con el idioma del proyecto
- Única deuda pendiente: configurar `MAIL_PASSWORD` en `backend/.env` con un App Password de Google para activar las notificaciones por correo
