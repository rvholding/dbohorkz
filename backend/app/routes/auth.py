import re
from datetime import datetime, timedelta, timezone
from flask import request, jsonify, current_app
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from app.routes import auth_bp
from app import db, limiter
from app.models import User


def _generate_token(user_id: int) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(
            hours=current_app.config['JWT_EXPIRATION_HOURS']
        )
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')


@auth_bp.route('/register', methods=['POST'])
@limiter.limit('10 per hour')
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', data['email']):
        return jsonify({'error': 'Email inválido'}), 400

    if len(data['password']) < 8:
        return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'El usuario ya existe'}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )

    try:
        db.session.add(user)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al registrar el usuario'}), 500

    token = _generate_token(user.id)
    return jsonify({
        'message': 'Usuario registrado exitosamente',
        'token': token,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }), 201


@auth_bp.route('/login', methods=['POST'])
@limiter.limit('5 per minute')
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ['username', 'password']):
        return jsonify({'error': 'Faltan credenciales'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    token = _generate_token(user.id)
    return jsonify({
        'message': 'Inicio de sesión exitoso',
        'token': token,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }), 200
