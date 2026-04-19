import os
import uuid
import cloudinary
import cloudinary.uploader
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.routes import products_bp
from app import db, limiter
from app.models import Product, ProductImage
from app.auth_middleware import require_admin

# Formatos permitidos para imágenes de producto
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_mime(file):
    header = file.read(12)
    file.seek(0)
    if header[:3] == b'\xff\xd8\xff':
        return True
    if header[:4] == b'\x89PNG':
        return True
    if header[:4] == b'RIFF' and header[8:12] == b'WEBP':
        return True
    return False


def _upload_to_cloudinary(file):
    """Sube un archivo a Cloudinary y retorna la URL pública."""
    cloud_name = current_app.config.get('CLOUDINARY_CLOUD_NAME')
    if not cloud_name:
        raise ValueError('Cloudinary no está configurado')

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=current_app.config.get('CLOUDINARY_API_KEY'),
        api_secret=current_app.config.get('CLOUDINARY_API_SECRET'),
        secure=True
    )
    result = cloudinary.uploader.upload(file, folder='dbohorkz')
    return result['secure_url']


def _upload_image(file):
    """Sube imagen a Cloudinary si está configurado, sino al filesystem local."""
    if current_app.config.get('CLOUDINARY_CLOUD_NAME'):
        return _upload_to_cloudinary(file)

    # Fallback local
    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))
    return f'/Images/{filename}'


def _validate_image(file):
    """Valida extensión, magic bytes y tamaño. Retorna error string o None."""
    if file.filename == '':
        return 'Nombre de archivo vacío'
    if not allowed_file(file.filename):
        return 'Formato no permitido. Use jpg, jpeg, png o webp'
    if not allowed_mime(file):
        return 'El contenido del archivo no corresponde a una imagen válida'
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return 'La imagen no puede superar 5 MB'
    return None


# ─── Rutas públicas ────────────────────────────────────────────────────────────

@products_bp.route('/', methods=['GET'])
@limiter.limit('120 per minute')
def get_products():
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
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


# ─── Rutas protegidas (solo admin) ────────────────────────────────────────────

@products_bp.route('/', methods=['POST'])
@require_admin
def create_product():
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
        sizes=str(data.get('sizes', ''))[:500],
        colors=str(data.get('colors', ''))[:500],
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
    if 'sizes' in data:
        product.sizes = str(data['sizes'])[:500]
    if 'colors' in data:
        product.colors = str(data['colors'])[:500]

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar el producto'}), 500

    return jsonify({'message': 'Producto actualizado', 'product': product.to_dict()}), 200


@products_bp.route('/upload-image', methods=['POST'])
@require_admin
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    error = _validate_image(file)
    if error:
        return jsonify({'error': error}), 400

    try:
        image_url = _upload_image(file)
    except Exception as e:
        return jsonify({'error': f'Error al subir imagen: {str(e)}'}), 500

    return jsonify({'image_url': image_url}), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@require_admin
def delete_product(product_id):
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
    product = Product.query.get_or_404(product_id)
    all_images = []
    if product.image_url:
        all_images.append({'id': 0, 'image_url': product.image_url, 'position': 0})
    all_images.extend([img.to_dict() for img in product.images])
    return jsonify({'images': all_images}), 200


@products_bp.route('/<int:product_id>/images', methods=['POST'])
@require_admin
def add_product_image(product_id):
    Product.query.get_or_404(product_id)

    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    error = _validate_image(file)
    if error:
        return jsonify({'error': error}), 400

    try:
        image_url = _upload_image(file)
    except Exception as e:
        return jsonify({'error': f'Error al subir imagen: {str(e)}'}), 500

    max_pos = db.session.query(db.func.max(ProductImage.position)).filter_by(product_id=product_id).scalar() or 0
    img = ProductImage(product_id=product_id, image_url=image_url, position=max_pos + 1)
    db.session.add(img)
    db.session.commit()

    return jsonify({'message': 'Imagen agregada', 'image': img.to_dict()}), 201


@products_bp.route('/<int:product_id>/images/<int:image_id>', methods=['DELETE'])
@require_admin
def delete_product_image(product_id, image_id):
    img = ProductImage.query.filter_by(id=image_id, product_id=product_id).first_or_404()
    db.session.delete(img)
    db.session.commit()
    return jsonify({'message': 'Imagen eliminada'}), 200
