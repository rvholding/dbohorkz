# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce application for "Uniformes Penitenciarios" with an AI chatbot and WhatsApp integration. Three-service architecture:

- **Backend**: Flask REST API (Python) — port 5000
- **Frontend**: React SPA (JavaScript) — port 3000
- **WhatsApp Service**: Node.js bot — port 3001

## Commands

### Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend (React)
```bash
cd frontend
npm install
npm start        # Dev server
npm run build    # Production build
npm test         # Run tests
```

### WhatsApp Service
```bash
cd whatsapp-service
npm install
npm run dev      # Dev with nodemon
npm start        # Production
```

### Full Stack (Docker)
```bash
docker-compose up                          # Production
docker-compose -f docker-compose.dev.yml up  # Development
```

## Architecture

### Data Flow
```
WhatsApp User → whatsapp-service (Node.js) → backend (Flask) → SQLite DB
Web User      → frontend (React)           → backend (Flask) → SQLite DB
```

### Backend (`backend/app/`)
- **Factory pattern**: `app/__init__.py` creates Flask app, initializes SQLAlchemy, registers blueprints
- **Models**: `User`, `Product`, `ChatMessage` (in `models/`)
- **Routes/Blueprints**: `auth` (`/api/auth/`), `products` (`/api/products/`), `chatbot` (`/api/chatbot/`)
- **Services**: `ChatbotService` — FAQ keyword-matching chatbot; optional OpenAI integration via `OPENAI_API_KEY`
- **Database**: SQLite by default; set `DATABASE_URL` env var for PostgreSQL in production

### Frontend (`frontend/src/`)
- Single page: `pages/Home.jsx` composes all sections
- Components: `Header`, `HeroSection`, `ProductsSection`, `ProductCard`, `Footer`
- Tailwind CSS via craco (configured in `craco.config.js`)
- Product data is currently hardcoded in `ProductsSection.jsx` — not yet fetched from API

### WhatsApp Service (`whatsapp-service/`)
- `server.js`: WhatsApp Web client (via `whatsapp-web.js`) + Express API
- Uses `LocalAuth` to persist session in `.wwebjs_auth/`
- On first run, displays QR code in terminal for phone authentication
- Forwards incoming messages to Flask `/api/chatbot/message` and replies with response
- REST endpoints: `GET /api/health`, `GET /api/info`, `POST /api/send-message`

## Known Issues / TODOs
- Password hashing is not implemented in `backend/app/routes/auth.py:22`
- No authentication middleware protecting routes
- Chatbot is FAQ-based only; OpenAI integration is prepared but not wired in

## Environment Variables

**Backend** (`.env` in `backend/`):
- `DATABASE_URL` — PostgreSQL URL (optional, falls back to SQLite)
- `SECRET_KEY` — Flask secret
- `OPENAI_API_KEY` — Optional, for AI chatbot
- `CORS_ORIGINS` — Allowed origins (default: `http://localhost:3000`)

**WhatsApp Service** (`.env` in `whatsapp-service/`):
- `FLASK_API_URL` — Backend URL (default: `http://localhost:5000`)
- `TYPING_DELAY` — Simulated typing delay in ms

## Deployment
- **Frontend**: Vercel (`vercel.json` at root configures SPA rewrites)
- **Backend + WhatsApp**: Railway (see `RAILWAY_SETUP.md`)
