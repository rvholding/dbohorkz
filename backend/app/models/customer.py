from app import db
from datetime import datetime


class Customer(db.Model):
    """Cliente preferencial — cuenta para acceder al portal /cliente."""
    __tablename__ = 'customers'

    id             = db.Column(db.Integer, primary_key=True)
    username       = db.Column(db.String(50), unique=True, nullable=False)
    password_hash  = db.Column(db.String(255), nullable=False)
    apellidos      = db.Column(db.String(255), default='')
    nombres        = db.Column(db.String(255), default='')
    celular        = db.Column(db.String(50), default='')
    active         = db.Column(db.Boolean, default=True)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'apellidos': self.apellidos or '',
            'nombres': self.nombres or '',
            'celular': self.celular or '',
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
