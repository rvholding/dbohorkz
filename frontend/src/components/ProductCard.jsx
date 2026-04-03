import React from 'react';

/**
 * Tarjeta individual de producto para el catálogo.
 * Muestra imagen, código de inventario, categoría, descripción, precio y stock.
 */
export default function ProductCard({ product }) {
  const { id, name, image_url, description, price, stock, codigo, categoria } = product;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-200">

      {/* Imagen del producto — muestra ícono de placeholder si no hay imagen */}
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        {image_url
          ? <img src={image_url} alt={name} className="object-contain h-44 w-full" />
          : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Sin imagen</span>
            </div>
          )
        }
      </div>

      {/* Nombre y código de inventario */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-base text-navy">{name}</h3>
        {/* Si no tiene código asignado, auto-genera uno basado en el ID */}
        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
          {codigo || `#${String(id).padStart(4, '0')}`}
        </span>
      </div>

      {/* Badge de categoría (solo si tiene una asignada) */}
      {categoria && (
        <span className="inline-block text-xs bg-navy/10 text-navy font-semibold px-2 py-0.5 rounded-full mb-1">{categoria}</span>
      )}

      {/* Descripción */}
      <p className="text-gray-500 text-sm mb-3 flex-1">{description}</p>

      {/* Precio y estado de stock */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gold-dark font-bold text-xl">
          ${typeof price === 'number' ? price.toLocaleString('es-CO') : price}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {stock > 0 ? `Stock: ${stock}` : 'Agotado'}
        </span>
      </div>

      {/* Botón de acción — deshabilitado si está agotado */}
      <button
        disabled={stock === 0}
        className="w-full bg-navy text-white py-2 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-gold hover:text-navy transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {stock > 0 ? 'Ver más' : 'Agotado'}
      </button>

    </div>
  );
}
