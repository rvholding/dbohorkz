from app import db
from datetime import datetime


class Testimonial(db.Model):
    __tablename__ = 'testimonials'

    id            = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    rating        = db.Column(db.Integer, default=5)  # 1 a 5 estrellas
    comment       = db.Column(db.Text, default='')
    image_url     = db.Column(db.String(500), default='')
    active        = db.Column(db.Boolean, default=True)
    position      = db.Column(db.Integer, default=0)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'rating': max(1, min(5, self.rating or 5)),
            'comment': self.comment or '',
            'image_url': self.image_url or '',
            'active': self.active,
            'position': self.position,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
