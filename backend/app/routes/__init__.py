from flask import Blueprint

# Crear blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
products_bp = Blueprint('products', __name__, url_prefix='/api/products')
chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')
orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# Importar rutas
from app.routes import auth, products, chatbot, orders
