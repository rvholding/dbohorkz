from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.routes import customers_bp
from app import db, limiter
from app.models import Customer
from app.auth_middleware import require_admin


def _generate_customer_token(customer_id):
    payload = {
        'customer_id': customer_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24 * 30),  # 30 días
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')


def require_customer(f):
    """Decorador que requiere autenticación de cliente preferencial."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Autenticación requerida'}), 401

        token = auth_header[len('Bearer '):]
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        if 'customer_id' not in payload:
            return jsonify({'error': 'Token no es de cliente'}), 401

        customer = Customer.query.get(payload['customer_id'])
        if not customer or not customer.active:
            return jsonify({'error': 'Cliente no encontrado o inactivo'}), 401

        g.current_customer = customer
        return f(*args, **kwargs)
    return decorated


# ─── Auth del cliente preferencial ───────────────────────────────────────────

@customers_bp.route('/login', methods=['POST'])
@limiter.limit('10 per minute')
def customer_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400

    customer = Customer.query.filter_by(username=data['username']).first()
    if not customer or not check_password_hash(customer.password_hash, data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    if not customer.active:
        return jsonify({'error': 'Cuenta desactivada'}), 403

    token = _generate_customer_token(customer.id)
    return jsonify({'token': token, 'customer': customer.to_dict()}), 200


@customers_bp.route('/me', methods=['GET'])
@require_customer
def get_me():
    return jsonify({'customer': g.current_customer.to_dict()}), 200


# ─── Admin CRUD de clientes preferenciales ───────────────────────────────────

@customers_bp.route('/', methods=['GET'])
@require_admin
def list_customers():
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return jsonify({'customers': [c.to_dict() for c in customers]}), 200


@customers_bp.route('/', methods=['POST'])
@require_admin
def create_customer():
    data = request.get_json()
    required = ['username', 'password', 'apellidos', 'nombres']
    if not data or not all(k in data and data[k] for k in required):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    if len(data['password']) < 6:
        return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400

    if Customer.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Ese usuario ya existe'}), 409

    c = Customer(
        username=str(data['username']).strip()[:50],
        password_hash=generate_password_hash(data['password']),
        apellidos=str(data.get('apellidos', ''))[:255],
        nombres=str(data.get('nombres', ''))[:255],
        celular=str(data.get('celular', ''))[:50],
        active=bool(data.get('active', True)),
    )

    try:
        db.session.add(c)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear cliente'}), 500

    return jsonify({'message': 'Cliente creado', 'customer': c.to_dict()}), 201


@customers_bp.route('/<int:customer_id>', methods=['PUT'])
@require_admin
def update_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    data = request.get_json() or {}

    if 'apellidos' in data:
        c.apellidos = str(data['apellidos'])[:255]
    if 'nombres' in data:
        c.nombres = str(data['nombres'])[:255]
    if 'celular' in data:
        c.celular = str(data['celular'])[:50]
    if 'active' in data:
        c.active = bool(data['active'])
    if 'password' in data and data['password']:
        if len(data['password']) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        c.password_hash = generate_password_hash(data['password'])

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar cliente'}), 500

    return jsonify({'message': 'Cliente actualizado', 'customer': c.to_dict()}), 200


@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
@require_admin
def delete_customer(customer_id):
    c = Customer.query.get_or_404(customer_id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({'message': 'Cliente eliminado'}), 200
