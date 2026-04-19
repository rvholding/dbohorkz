from app import db
from datetime import datetime


def _split_csv(value):
    """Convierte 'S, M, L' en ['S', 'M', 'L']. Retorna [] si vacío."""
    if not value:
        return []
    return [v.strip() for v in value.split(',') if v.strip()]


class Product(db.Model):
    __tablename__ = 'products'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price       = db.Column(db.Float, nullable=False)
    stock       = db.Column(db.Integer, default=0)
    image_url   = db.Column(db.String(500))
    codigo      = db.Column(db.String(50))
    categoria   = db.Column(db.String(100))
    sizes       = db.Column(db.String(500), default='')   # CSV: "S,M,L,XL" o "38,40,42"
    colors      = db.Column(db.String(500), default='')   # CSV: "Negro,Azul,Verde"
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Product {self.name}>'

    def to_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'description': self.description,
            'price':       self.price,
            'stock':       self.stock,
            'image_url':   self.image_url,
            'codigo':      self.codigo or '',
            'categoria':   self.categoria or '',
            'sizes':       _split_csv(self.sizes),
            'colors':      _split_csv(self.colors),
            'images':      [img.to_dict() for img in self.images],
        }
