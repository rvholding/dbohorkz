import logging
import threading
import resend
from flask import request, jsonify, g, current_app
from app.routes import chatbot_bp
from app import db
from app.models import ChatMessage
from app.services import ChatbotService
from app.auth_middleware import require_auth

logger = logging.getLogger(__name__)

# Instancia global del chatbot (carga las respuestas FAQ una sola vez)
chatbot = ChatbotService()

MAX_MESSAGE_LENGTH = 1000  # Caracteres máximos por mensaje


@chatbot_bp.route('/message', methods=['POST'])
def send_message():
    """
    Recibe un mensaje del usuario (web o WhatsApp), genera una respuesta con el chatbot,
    guarda el intercambio en la BD y opcionalmente envía una notificación por correo al admin.

    Body JSON:
      - message (str, requerido)
      - user_id (int, opcional) — para asociar el mensaje a un usuario registrado
      - platform (str) — 'web' o 'whatsapp'
    """
    data = request.get_json()

    if not data or 'message' not in data:
        return jsonify({'error': 'Mensaje requerido'}), 400

    user_message = str(data['message']).strip()
    if not user_message:
        return jsonify({'error': 'El mensaje no puede estar vacío'}), 400
    if len(user_message) > MAX_MESSAGE_LENGTH:
        return jsonify({'error': f'El mensaje no puede superar {MAX_MESSAGE_LENGTH} caracteres'}), 400

    user_id  = data.get('user_id')
    platform = data.get('platform', 'web')
    if platform not in ('web', 'whatsapp'):
        platform = 'web'

    # Obtener respuesta del chatbot FAQ
    bot_response = chatbot.get_response(user_message)

    # Guardar el intercambio en la base de datos
    chat_msg = ChatMessage(
        user_id=user_id,
        sender='user',
        message=user_message,
        response=bot_response,
        platform=platform
    )

    try:
        db.session.add(chat_msg)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al guardar el mensaje'}), 500

    # Notificación por correo al admin en hilo separado usando Resend
    if current_app.config.get('RESEND_API_KEY'):
        api_key = current_app.config['RESEND_API_KEY']
        recipient = current_app.config['MAIL_RECIPIENT']
        def send_mail():
            try:
                print(f'[RESEND] Enviando correo a {recipient}...', flush=True)
                resend.api_key = api_key
                resend.Emails.send({
                    'from': 'dbohorkz <no-reply@dbohorkz.com>',
                    'to': [recipient],
                    'subject': '📬 Nuevo mensaje de contacto — dbohorkz Intendencia Militar',
                    'html': f"""
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                      <div style="background:#1a1f3a;padding:24px;text-align:center;">
                        <h2 style="color:#C9A84C;margin:0;font-size:20px;">dbohorkz Intendencia Militar</h2>
                        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">Nuevo mensaje desde el sitio web</p>
                      </div>
                      <div style="padding:28px;">
                        <p style="margin:0 0 16px;"><strong>Plataforma:</strong> {platform}</p>
                        <p style="margin:0 0 16px;"><strong>Mensaje:</strong></p>
                        <div style="background:#f5f5f5;border-left:4px solid #C9A84C;padding:12px 16px;border-radius:4px;font-size:14px;">
                          {user_message}
                        </div>
                        <p style="margin:16px 0 0;"><strong>Respuesta del bot:</strong> {bot_response}</p>
                      </div>
                      <div style="background:#f9f9f9;padding:16px;text-align:center;font-size:12px;color:#999;">
                        dbohorkz Intendencia Militar · 314 218 70 98
                      </div>
                    </div>
                    """
                })
                print('[RESEND] Correo enviado correctamente', flush=True)
            except Exception as e:
                print(f'[RESEND] ERROR: {e}', flush=True)
        threading.Thread(target=send_mail, daemon=True).start()

    return jsonify({
        'id':           chat_msg.id,
        'user_message': user_message,
        'bot_response': bot_response,
        'timestamp':    chat_msg.timestamp.isoformat(),
        'platform':     platform
    }), 200


@chatbot_bp.route('/faq', methods=['GET'])
def get_faq():
    """Retorna la lista de preguntas frecuentes disponibles en el chatbot."""
    return jsonify(chatbot.get_faq_list()), 200


@chatbot_bp.route('/history/<int:user_id>', methods=['GET'])
@require_auth
def get_chat_history(user_id):
    """
    Retorna el historial de mensajes de un usuario específico.
    Solo el propio usuario (autenticado) puede ver su historial.
    """
    # Evitar que un admin vea el historial de otro usuario arbitrario
    if g.current_user.id != user_id:
        return jsonify({'error': 'No autorizado para ver este historial'}), 403

    page     = max(request.args.get('page', 1, type=int), 1)
    per_page = min(max(request.args.get('per_page', 20, type=int), 1), 100)
    pagination = ChatMessage.query.filter_by(user_id=user_id)\
        .order_by(ChatMessage.timestamp.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'messages': [m.to_dict() for m in pagination.items],
        'total':    pagination.total,
        'page':     pagination.page,
        'pages':    pagination.pages
    }), 200
