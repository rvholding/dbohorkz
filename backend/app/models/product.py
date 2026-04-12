from app import db
from datetime import datetime


class Product(db.Model):
    """
    Modelo de Producto del catálogo.
    Cada producto tiene código de inventario, categoría, imagen y control de stock.
    """
    __tablename__ = 'products'

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price       = db.Column(db.Float, nullable=False)
    stock       = db.Column(db.Integer, default=0)
    image_url   = db.Column(db.String(500))          # Ruta relativa: /Images/nombre.jpg
    codigo      = db.Column(db.String(50))            # Código de inventario interno (ej: UNI-001)
    categoria   = db.Column(db.String(100))           # Categoría para filtrar en el catálogo
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Product {self.name}>'

    def to_dict(self):
        """Serializa el producto a diccionario para retornar como JSON."""
        return {
            'id':          self.id,
            'name':        self.name,
            'description': self.description,
            'price':       self.price,
            'stock':       self.stock,
            'image_url':   self.image_url,
            'codigo':      self.codigo or '',
            'categoria':   self.categoria or '',
            'images':      [img.to_dict() for img in self.images],
        }
