from app import db
from datetime import datetime

class ChatMessage(db.Model):
    """Modelo de Mensaje de Chat"""
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    sender = db.Column(db.String(20), nullable=False)  # 'user' o 'bot'
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text)
    platform = db.Column(db.String(20), default='web')  # 'web' o 'whatsapp'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ChatMessage {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender,
            'message': self.message,
            'response': self.response,
            'platform': self.platform,
            'timestamp': self.timestamp.isoformat()
        }
