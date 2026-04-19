import json
from app import db
from datetime import datetime


class CatalogItem(db.Model):
    """
    Item del catálogo preferencial (plantilla de contingente).
    Las opciones (tallas, colores de bordado, adicionales) se guardan como JSON en options_json.

    Formato de options_json (lista):
    [
      {"type": "size",   "values": ["S","M","L","XL"]},
      {"type": "color",  "values": ["Gris","Dorado","Negro"]},
      {"type": "addon",  "label": "Con cremallera",    "price": 5000},
      {"type": "addon",  "label": "Apellido marcado", "price": 2000}
    ]
    """
    __tablename__ = 'catalog_items'

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(500), nullable=False)
    description  = db.Column(db.Text, default='')
    base_price   = db.Column(db.Float, nullable=False, default=0)
    position     = db.Column(db.Integer, default=0)
    active       = db.Column(db.Boolean, default=True)
    options_json = db.Column(db.Text, default='[]')
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def get_options(self):
        try:
            return json.loads(self.options_json or '[]')
        except (json.JSONDecodeError, TypeError):
            return []

    def set_options(self, options):
        self.options_json = json.dumps(options or [])

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description or '',
            'base_price': self.base_price,
            'position': self.position,
            'active': self.active,
            'options': self.get_options(),
        }
