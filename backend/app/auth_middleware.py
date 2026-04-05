from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
from app.models import User


def require_auth(f):
    """Decorador de autenticación JWT. Valida el token y carga el usuario en g.current_user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de autenticación requerido'}), 401

        token = auth_header[len('Bearer '):]
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 401

        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    """
    Decorador que exige que el usuario autenticado sea el administrador.
    El username del admin se define en ADMIN_USERNAME (variable de entorno).
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de autenticación requerido'}), 401

        token = auth_header[len('Bearer '):]
        try:
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 401

        admin_username = current_app.config.get('ADMIN_USERNAME', 'admin')
        if user.username != admin_username:
            return jsonify({'error': 'Acceso de administrador requerido'}), 403

        g.current_user = user
        return f(*args, **kwargs)
    return decorated
