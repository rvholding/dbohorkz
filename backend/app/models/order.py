from app import db
from datetime import datetime
import random
import string


class Order(db.Model):
    __tablename__ = 'orders'

    id          = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    customer_name = db.Column(db.String(255), default='')
    customer_phone = db.Column(db.String(50), default='')
    total       = db.Column(db.Float, nullable=False)
    status      = db.Column(db.String(20), default='pendiente')  # pendiente, confirmado, enviado, entregado, cancelado
    notes       = db.Column(db.Text, default='')
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    items       = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    @staticmethod
    def generate_number():
        date_part = datetime.utcnow().strftime('%Y%m%d')
        rand_part = ''.join(random.choices(string.digits, k=4))
        return f'PED-{date_part}-{rand_part}'

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'total': self.total,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items],
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id          = db.Column(db.Integer, primary_key=True)
    order_id    = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id  = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    product_name = db.Column(db.String(255), nullable=False)
    price       = db.Column(db.Float, nullable=False)
    qty         = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'price': self.price,
            'qty': self.qty,
            'subtotal': self.price * self.qty,
        }
