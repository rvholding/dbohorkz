from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
from app.models import User


def require_auth(f):
    """
    Decorador de autenticación JWT.
    Úsalo en cualquier ruta que solo deba ser accesible por el administrador.

    Flujo:
    1. Lee el header 'Authorization: Bearer <token>'
    2. Decodifica y valida el JWT con la clave secreta
    3. Carga el usuario en g.current_user para que la ruta lo use si necesita
    4. Si algo falla, retorna 401 sin ejecutar la ruta
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        # El header debe tener el formato "Bearer <token>"
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

        # Verificar que el usuario del token aún existe en la BD
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 401

        # Guardar el usuario en el contexto de la petición
        g.current_user = user
        return f(*args, **kwargs)
    return decorated
