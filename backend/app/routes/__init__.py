from flask import Blueprint

# Crear blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
products_bp = Blueprint('products', __name__, url_prefix='/api/products')
chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')
orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')
testimonials_bp = Blueprint('testimonials', __name__, url_prefix='/api/testimonials')
customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')
catalog_bp = Blueprint('catalog', __name__, url_prefix='/api/catalog')

# Importar rutas
from app.routes import auth, products, chatbot, orders, testimonials, customers, catalog
