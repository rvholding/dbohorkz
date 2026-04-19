from flask import request, jsonify
from app.routes import testimonials_bp
from app import db, limiter
from app.models import Testimonial
from app.auth_middleware import require_admin


@testimonials_bp.route('/', methods=['GET'])
def list_testimonials():
    """Lista testimonios activos (público). Admin puede ver todos con ?all=1"""
    query = Testimonial.query
    if request.args.get('all') != '1':
        query = query.filter_by(active=True)
    testimonials = query.order_by(Testimonial.position.desc(), Testimonial.created_at.desc()).all()
    return jsonify({'testimonials': [t.to_dict() for t in testimonials]}), 200


@testimonials_bp.route('/', methods=['POST'])
@limiter.limit('3 per hour')
def create_testimonial():
    """Ruta pública — cualquiera puede dejar una calificación. Rate limit anti-abuso."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos requeridos'}), 400

    rating = data.get('rating', 5)
    try:
        rating = int(rating)
    except (TypeError, ValueError):
        rating = 5
    rating = max(1, min(5, rating))

    customer_name = str(data.get('customer_name', '')).strip()[:255] or 'Anónimo'
    comment = str(data.get('comment', '')).strip()[:1000]

    t = Testimonial(
        customer_name=customer_name,
        rating=rating,
        comment=comment,
        image_url='',
        active=True,
        position=0,
    )

    try:
        db.session.add(t)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el testimonio'}), 500

    return jsonify({'message': 'Testimonio creado', 'testimonial': t.to_dict()}), 201


@testimonials_bp.route('/<int:testimonial_id>', methods=['PUT'])
@require_admin
def update_testimonial(testimonial_id):
    t = Testimonial.query.get_or_404(testimonial_id)
    data = request.get_json() or {}

    if 'customer_name' in data:
        t.customer_name = str(data['customer_name'])[:255]
    if 'rating' in data:
        try:
            r = int(data['rating'])
            t.rating = max(1, min(5, r))
        except (TypeError, ValueError):
            pass
    if 'comment' in data:
        t.comment = str(data['comment'])
    if 'image_url' in data:
        t.image_url = str(data['image_url'])[:500]
    if 'active' in data:
        t.active = bool(data['active'])
    if 'position' in data:
        try:
            t.position = int(data['position'])
        except (TypeError, ValueError):
            pass

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el testimonio'}), 500

    return jsonify({'message': 'Testimonio actualizado', 'testimonial': t.to_dict()}), 200


@testimonials_bp.route('/<int:testimonial_id>', methods=['DELETE'])
@require_admin
def delete_testimonial(testimonial_id):
    t = Testimonial.query.get_or_404(testimonial_id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'message': 'Testimonio eliminado'}), 200
