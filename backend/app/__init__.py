import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail
from app.config import Config

# Configuración del logger para toda la aplicación
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Instancias globales de extensiones — se inicializan dentro de create_app()
db = SQLAlchemy()
mail = Mail()


def create_app():
    """
    Factory de la aplicación Flask.
    Inicializa extensiones, registra blueprints y crea las tablas de la BD.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones con la app
    db.init_app(app)
    mail.init_app(app)

    # Permitir peticiones desde el frontend (CORS_ORIGINS viene del .env)
    CORS(app, origins=app.config['CORS_ORIGINS'])

    # Registrar blueprints (grupos de rutas)
    from app.routes import auth_bp, products_bp, chatbot_bp
    app.register_blueprint(auth_bp)       # /api/auth/
    app.register_blueprint(products_bp)   # /api/products/
    app.register_blueprint(chatbot_bp)    # /api/chatbot/

    # Crear tablas si no existen (SQLite o PostgreSQL según DATABASE_URL)
    with app.app_context():
        db.metadata.create_all(bind=db.engine, checkfirst=True)

    logger.info('App creada correctamente')
    return app
