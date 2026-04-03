import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { productosAPI } from '../services/api';

// Categorías del catálogo — el valor (array vacío) es un placeholder;
// el filtrado real usa el campo `categoria` que viene de la base de datos.
const CATEGORIAS = {
  'Todos': null,
  'Uniformes y Vestimenta': [],
  'Uniforme #3': [],
  'Gorras': [],
  'Chapuzas': [],
  'Linternas': [],
  'Bolsos': [],
  'Presillas': [],
  'Correaje y Cinturones': [],
  'Portatiles y Fundas': [],
  'Insignias y Bordados': [],
  'Defensa y Seguridad': [],
  'Equipos y Accesorios': [],
  'Elementos para Curso': [],
};


export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // Carga todos los productos al montar el componente (máximo 100 por página)
  useEffect(() => {
    productosAPI.getAll(1, 100)
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('No se pudieron cargar los productos. Intente más tarde.'))
      .finally(() => setLoading(false));
  }, []);

  // Filtra los productos según la categoría seleccionada
  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todos') return products;
    return products.filter(p => p.categoria === categoriaActiva);
  }, [products, categoriaActiva]);

  // Calcula cuántos productos hay en cada categoría para mostrarlo en el badge
  const conteos = useMemo(() => {
    const c = { 'Todos': products.length };
    Object.keys(CATEGORIAS).forEach(cat => {
      if (cat !== 'Todos') c[cat] = products.filter(p => p.categoria === cat).length;
    });
    return c;
  }, [products]);

  return (
    <section className="py-16 bg-gray-50" id="productos">
      <div className="container mx-auto px-6">

        {/* Encabezado de sección */}
        <div className="text-center mb-8">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Catálogo</p>
          <h2 className="text-3xl font-bold text-navy">Nuestros Productos</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        {/* Botones de filtro por categoría — se muestran solo cuando hay productos cargados */}
        {!loading && !error && products.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.keys(CATEGORIAS).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  categoriaActiva === cat
                    ? 'bg-gold text-navy border-gold shadow-md'
                    : 'bg-white text-navy border-gray-200 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
                {/* Badge con el conteo de productos en esa categoría */}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${categoriaActiva === cat ? 'bg-navy text-gold' : 'bg-gray-100 text-gray-500'}`}>
                  {conteos[cat] || 0}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        )}

        {/* Error al cargar */}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {/* Sin resultados en la categoría seleccionada */}
        {!loading && !error && productosFiltrados.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay productos en esta categoría.</p>
        )}

        {/* Grid de productos */}
        {!loading && !error && productosFiltrados.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4 text-center">
              Mostrando <span className="font-semibold text-navy">{productosFiltrados.length}</span> productos
              {categoriaActiva !== 'Todos' && <> en <span className="font-semibold text-gold">{categoriaActiva}</span></>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productosFiltrados.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
