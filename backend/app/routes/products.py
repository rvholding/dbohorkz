import os
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.routes import products_bp
from app import db
from app.models import Product
from app.auth_middleware import require_auth

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
@require_auth
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
@require_auth
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
@require_auth
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

    filename = secure_filename(file.filename)
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))

    return jsonify({'image_url': f'/Images/{filename}'}), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@require_auth
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
