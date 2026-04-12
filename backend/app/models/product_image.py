from app import db
from datetime import datetime


class ProductImage(db.Model):
    """Imagen adicional de un producto (galería de múltiples ángulos)."""
    __tablename__ = 'product_images'

    id         = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    image_url  = db.Column(db.String(500), nullable=False)
    position   = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product', backref=db.backref('images', lazy=True, order_by='ProductImage.position', cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'position': self.position,
        }
