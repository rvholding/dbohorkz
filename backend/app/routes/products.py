import os
import uuid
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.routes import products_bp
from app import db, limiter
from app.models import Product, ProductImage
from app.auth_middleware import require_admin

# Formatos permitidos para imágenes de producto
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def allowed_file(filename):
    """Verifica que la extensión del archivo esté en la lista permitida."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_mime(file):
    """
    Valida el tipo real del archivo leyendo sus primeros bytes (magic bytes).
    Previene que alguien suba un archivo malicioso renombrado como .jpg.
    """
    header = file.read(12)
    file.seek(0)
    if header[:3] == b'\xff\xd8\xff':           # JPEG
        return True
    if header[:4] == b'\x89PNG':                 # PNG
        return True
    if header[:4] == b'RIFF' and header[8:12] == b'WEBP':  # WEBP
        return True
    return False


# ─── Rutas públicas ────────────────────────────────────────────────────────────

@products_bp.route('/', methods=['GET'])
@limiter.limit('120 per minute')
def get_products():
    """
    Lista productos con paginación.
    Query params: page (int), per_page (int, máx 100)
    """
    page     = max(request.args.get('page', 1, type=int), 1)
    per_page = min(max(request.args.get('per_page', 20, type=int), 1), 100)
    pagination = Product.query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify({
        'products': [p.to_dict() for p in pagination.items],
        'total':    pagination.total,
        'page':     pagination.page,
        'pages':    pagination.pages
    }), 200


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retorna un producto por ID. Devuelve 404 si no existe."""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


# ─── Rutas protegidas (solo admin) ────────────────────────────────────────────

@products_bp.route('/', methods=['POST'])
@require_admin
def create_product():
    """
    Crea un nuevo producto.
    Requiere JWT válido en el header Authorization.
    Body JSON: name (requerido), price (requerido), description, stock, image_url, codigo, categoria
    """
    data = request.get_json()

    if not data or 'name' not in data or 'price' not in data:
        return jsonify({'error': 'Faltan datos requeridos (name, price)'}), 400

    if not isinstance(data['price'], (int, float)) or data['price'] < 0:
        return jsonify({'error': 'El precio debe ser un número positivo'}), 400

    stock = data.get('stock', 0)
    if not isinstance(stock, int) or stock < 0:
        return jsonify({'error': 'El stock debe ser un entero no negativo'}), 400

    product = Product(
        name=str(data['name'])[:255],
        description=str(data.get('description', '')),
        price=float(data['price']),
        stock=int(stock),
        image_url=str(data.get('image_url', ''))[:500],
        codigo=str(data.get('codigo', ''))[:50],
        categoria=str(data.get('categoria', ''))[:100],
    )

    try:
        db.session.add(product)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el producto'}), 500

    return jsonify({'message': 'Producto creado', 'product': product.to_dict()}), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
@require_admin
def update_product(product_id):
    """
    Actualiza los campos enviados de un producto existente.
    Solo modifica los campos que vienen en el body (PATCH-like).
    """
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se enviaron datos'}), 400

    if 'name' in data:
        product.name = str(data['name'])[:255]
    if 'description' in data:
        product.description = str(data['description'])
    if 'price' in data:
        if not isinstance(data['price'], (int, float)) or data['price'] < 0:
            return jsonify({'error': 'El precio debe ser un número positivo'}), 400
        product.price = float(data['price'])
    if 'stock' in data:
        if not isinstance(data['stock'], int) or data['stock'] < 0:
            return jsonify({'error': 'El stock debe ser un entero no negativo'}), 400
        product.stock = int(data['stock'])
    if 'image_url' in data:
        product.image_url = str(data['image_url'])[:500]
    if 'codigo' in data:
        product.codigo = str(data['codigo'])[:50]
    if 'categoria' in data:
        product.categoria = str(data['categoria'])[:100]

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el producto'}), 500

    return jsonify({'message': 'Producto actualizado', 'product': product.to_dict()}), 200


@products_bp.route('/upload-image', methods=['POST'])
@require_admin
def upload_image():
    """
    Sube una imagen de producto al servidor.
    La guarda en frontend/public/Images/ para que React la sirva como /Images/nombre.jpg
    Validaciones: extensión, magic bytes, tamaño máximo 5 MB.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Formato no permitido. Use jpg, jpeg, png o webp'}), 400

    if not allowed_mime(file):
        return jsonify({'error': 'El contenido del archivo no corresponde a una imagen válida'}), 400

    # Verificar tamaño (seek al final, luego volver al inicio)
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return jsonify({'error': 'La imagen no puede superar 5 MB'}), 400

    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))

    return jsonify({'image_url': f'/Images/{filename}'}), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@require_admin
def delete_product(product_id):
    """Elimina un producto por ID. Solo accesible por el admin."""
    product = Product.query.get_or_404(product_id)

    try:
        db.session.delete(product)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar el producto'}), 500

    return jsonify({'message': 'Producto eliminado'}), 200


# ─── Imágenes adicionales (galería) ──────────────────────────────────────────

@products_bp.route('/<int:product_id>/images', methods=['GET'])
def get_product_images(product_id):
    """Lista todas las imágenes de un producto (incluye la principal)."""
    product = Product.query.get_or_404(product_id)
    all_images = []
    if product.image_url:
        all_images.append({'id': 0, 'image_url': product.image_url, 'position': 0})
    all_images.extend([img.to_dict() for img in product.images])
    return jsonify({'images': all_images}), 200


@products_bp.route('/<int:product_id>/images', methods=['POST'])
@require_admin
def add_product_image(product_id):
    """Sube una imagen adicional a la galería de un producto."""
    Product.query.get_or_404(product_id)

    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    if file.filename == '' or not allowed_file(file.filename) or not allowed_mime(file):
        return jsonify({'error': 'Archivo inválido'}), 400

    file.seek(0, 2)
    if file.tell() > MAX_FILE_SIZE:
        return jsonify({'error': 'La imagen no puede superar 5 MB'}), 400
    file.seek(0)

    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))

    max_pos = db.session.query(db.func.max(ProductImage.position)).filter_by(product_id=product_id).scalar() or 0
    img = ProductImage(product_id=product_id, image_url=f'/Images/{filename}', position=max_pos + 1)
    db.session.add(img)
    db.session.commit()

    return jsonify({'message': 'Imagen agregada', 'image': img.to_dict()}), 201


@products_bp.route('/<int:product_id>/images/<int:image_id>', methods=['DELETE'])
@require_admin
def delete_product_image(product_id, image_id):
    """Elimina una imagen de la galería de un producto."""
    img = ProductImage.query.filter_by(id=image_id, product_id=product_id).first_or_404()
    db.session.delete(img)
    db.session.commit()
    return jsonify({'message': 'Imagen eliminada'}), 200
