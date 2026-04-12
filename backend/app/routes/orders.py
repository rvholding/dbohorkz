from flask import request, jsonify
from app.routes import orders_bp
from app import db
from app.models import Order, OrderItem
from app.auth_middleware import require_admin


@orders_bp.route('/', methods=['POST'])
def create_order():
    """Crea un pedido desde el carrito del cliente."""
    data = request.get_json()

    if not data or 'items' not in data or len(data['items']) == 0:
        return jsonify({'error': 'El pedido debe tener al menos un producto'}), 400

    order = Order(
        order_number=Order.generate_number(),
        customer_name=str(data.get('customer_name', ''))[:255],
        customer_phone=str(data.get('customer_phone', ''))[:50],
        total=0,
        notes=str(data.get('notes', '')),
    )

    total = 0
    for item_data in data['items']:
        if 'product_name' not in item_data or 'price' not in item_data or 'qty' not in item_data:
            continue
        item = OrderItem(
            product_id=item_data.get('product_id'),
            product_name=str(item_data['product_name'])[:255],
            price=float(item_data['price']),
            qty=int(item_data['qty']),
        )
        order.items.append(item)
        total += item.price * item.qty

    order.total = total

    try:
        db.session.add(order)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el pedido'}), 500

    return jsonify({'message': 'Pedido creado', 'order': order.to_dict()}), 201


@orders_bp.route('/', methods=['GET'])
@require_admin
def list_orders():
    """Lista todos los pedidos (solo admin)."""
    page = max(request.args.get('page', 1, type=int), 1)
    per_page = min(max(request.args.get('per_page', 20, type=int), 1), 100)
    status_filter = request.args.get('status', '')

    query = Order.query.order_by(Order.created_at.desc())
    if status_filter:
        query = query.filter_by(status=status_filter)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'orders': [o.to_dict() for o in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
    }), 200


@orders_bp.route('/<int:order_id>', methods=['PUT'])
@require_admin
def update_order(order_id):
    """Actualiza el estado de un pedido (solo admin)."""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    if 'status' in data:
        order.status = str(data['status'])[:20]
    if 'notes' in data:
        order.notes = str(data['notes'])

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el pedido'}), 500

    return jsonify({'message': 'Pedido actualizado', 'order': order.to_dict()}), 200
