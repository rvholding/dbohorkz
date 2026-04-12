import React, { useState, useEffect } from 'react';
import { productosAPI, imageUrl } from '../services/api';

export default function ProductModal({ product, onClose }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productosAPI.getImages(product.id)
      .then(res => {
        const imgs = res.data.images || [];
        setImages(imgs.length > 0 ? imgs : product.image_url ? [{ image_url: product.image_url }] : []);
      })
      .catch(() => {
        if (product.image_url) setImages([{ image_url: product.image_url }]);
      })
      .finally(() => setLoading(false));
  }, [product]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images, onClose]);

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg text-navy">{product.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Galeria */}
        <div className="relative bg-gray-50">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
            </div>
          ) : images.length > 0 ? (
            <>
              <img
                src={imageUrl(images[current]?.image_url)}
                alt={`${product.name} - foto ${current + 1}`}
                className="w-full h-80 sm:h-96 object-contain"
              />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 text-xl">&lsaquo;</button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 text-xl">&rsaquo;</button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-20 text-gray-300">
              <span>Sin imágenes</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 justify-center overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === current ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={imageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Detalles */}
        <div className="p-4 space-y-2">
          {product.categoria && (
            <span className="inline-block text-xs bg-navy/10 text-navy font-semibold px-2 py-0.5 rounded-full">{product.categoria}</span>
          )}
          {product.description && <p className="text-gray-600 text-sm">{product.description}</p>}
          <p className="text-gold-dark font-bold text-2xl">
            ${typeof product.price === 'number' ? product.price.toLocaleString('es-CO') : product.price}
          </p>
          <a
            href={`https://wa.me/573142187098?text=Hola, me interesa el producto: ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
