from flask import request, jsonify, g
from app.routes import catalog_bp
from app import db
from app.models import CatalogItem
from app.auth_middleware import require_admin
from app.routes.customers import require_customer


@catalog_bp.route('/', methods=['GET'])
@require_customer
def list_catalog():
    """Lista items del catálogo preferencial (solo clientes autenticados)."""
    items = CatalogItem.query.filter_by(active=True).order_by(CatalogItem.position.asc(), CatalogItem.id.asc()).all()
    return jsonify({'items': [i.to_dict() for i in items]}), 200


@catalog_bp.route('/admin', methods=['GET'])
@require_admin
def list_catalog_admin():
    """Admin: lista todos los items (incluidos inactivos)."""
    items = CatalogItem.query.order_by(CatalogItem.position.asc(), CatalogItem.id.asc()).all()
    return jsonify({'items': [i.to_dict() for i in items]}), 200


@catalog_bp.route('/', methods=['POST'])
@require_admin
def create_catalog_item():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Falta el nombre'}), 400

    item = CatalogItem(
        name=str(data['name'])[:500],
        description=str(data.get('description', '')),
        base_price=float(data.get('base_price', 0)),
        position=int(data.get('position', 0)),
        active=bool(data.get('active', True)),
    )
    item.set_options(data.get('options', []))

    try:
        db.session.add(item)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear item'}), 500

    return jsonify({'message': 'Item creado', 'item': item.to_dict()}), 201


@catalog_bp.route('/<int:item_id>', methods=['PUT'])
@require_admin
def update_catalog_item(item_id):
    item = CatalogItem.query.get_or_404(item_id)
    data = request.get_json() or {}

    if 'name' in data:
        item.name = str(data['name'])[:500]
    if 'description' in data:
        item.description = str(data['description'])
    if 'base_price' in data:
        try:
            item.base_price = float(data['base_price'])
        except (TypeError, ValueError):
            pass
    if 'position' in data:
        try:
            item.position = int(data['position'])
        except (TypeError, ValueError):
            pass
    if 'active' in data:
        item.active = bool(data['active'])
    if 'options' in data:
        item.set_options(data['options'])

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar'}), 500

    return jsonify({'message': 'Item actualizado', 'item': item.to_dict()}), 200


@catalog_bp.route('/<int:item_id>', methods=['DELETE'])
@require_admin
def delete_catalog_item(item_id):
    item = CatalogItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item eliminado'}), 200
