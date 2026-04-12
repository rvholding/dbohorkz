import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { productosAPI } from '../services/api';

const CATEGORIAS = [
  'Uniformes y Vestimenta',
  'Uniforme #3',
  'Gorras',
  'Chapuzas',
  'Linternas',
  'Bolsos',
  'Presillas',
  'Correaje y Cinturones',
  'Portatiles y Fundas',
  'Insignias y Bordados',
  'Defensa y Seguridad',
  'Equipos y Accesorios',
  'Elementos para Curso',
];


export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    productosAPI.getAll(1, 100)
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('No se pudieron cargar los productos. Intente más tarde.'))
      .finally(() => setLoading(false));
  }, []);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todos') return products;
    return products.filter(p => p.categoria === categoriaActiva);
  }, [products, categoriaActiva]);

  const conteos = useMemo(() => {
    const c = { 'Todos': products.length };
    CATEGORIAS.forEach(cat => {
      c[cat] = products.filter(p => p.categoria === cat).length;
    });
    return c;
  }, [products]);

  function selectCategoria(cat) {
    setCategoriaActiva(cat);
    setMobileSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="space-y-1">
      {/* Accordion header */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="w-full flex items-center justify-between py-3 px-1 border-b-2 border-gold text-left"
      >
        <span className="font-bold text-navy uppercase tracking-wide text-sm">Categoría</span>
        <span className="text-gray-400 text-lg">{sidebarOpen ? '−' : '+'}</span>
      </button>

      {sidebarOpen && (
        <div className="space-y-0.5 pt-2">
          <button
            onClick={() => selectCategoria('Todos')}
            className={`w-full text-left px-2 py-2 text-sm rounded transition-colors ${
              categoriaActiva === 'Todos'
                ? 'bg-gold/10 text-gold font-bold border-l-3 border-gold'
                : 'text-gray-700 hover:text-gold hover:bg-gray-50'
            }`}
          >
            Todos
            <span className="ml-1 text-xs text-gray-400">({conteos['Todos'] || 0})</span>
          </button>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => selectCategoria(cat)}
              className={`w-full text-left px-2 py-2 text-sm rounded transition-colors ${
                categoriaActiva === cat
                  ? 'bg-gold/10 text-gold font-bold border-l-3 border-gold'
                  : 'text-gray-700 hover:text-gold hover:bg-gray-50'
              }`}
            >
              {cat}
              <span className="ml-1 text-xs text-gray-400">({conteos[cat] || 0})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-gray-50" id="productos">
      <div className="container mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Catálogo</p>
          <h2 className="text-3xl font-bold text-navy">Nuestros Productos</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        {/* Botón categorías en móvil */}
        {!loading && !error && products.length > 0 && (
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden w-full mb-4 flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
          >
            <span className="font-semibold text-navy text-sm">
              {categoriaActiva === 'Todos' ? 'Todas las categorías' : categoriaActiva}
            </span>
            <span className="text-gray-400">{mobileSidebarOpen ? '▲' : '▼'}</span>
          </button>
        )}

        {/* Sidebar móvil (dropdown) */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
            {sidebarContent}
          </div>
        )}

        {/* Layout principal: sidebar + grid */}
        <div className="flex gap-8">

          {/* Sidebar desktop */}
          {!loading && !error && products.length > 0 && (
            <aside className="hidden md:block w-56 flex-shrink-0">
              <div className="sticky top-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-navy text-base mb-3">Busca por Catálogo:</h3>
                <div className="w-full h-0.5 bg-gold/30 mb-3"></div>
                {sidebarContent}
              </div>
            </aside>
          )}

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Estado de carga */}
            {loading && (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              </div>
            )}

            {/* Error */}
            {error && <p className="text-center text-red-500 py-8">{error}</p>}

            {/* Sin resultados */}
            {!loading && !error && productosFiltrados.length === 0 && (
              <p className="text-center text-gray-400 py-8">No hay productos en esta categoría.</p>
            )}

            {/* Grid de productos */}
            {!loading && !error && productosFiltrados.length > 0 && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Mostrando <span className="font-semibold text-navy">{productosFiltrados.length}</span> productos
                  {categoriaActiva !== 'Todos' && <> en <span className="font-semibold text-gold">{categoriaActiva}</span></>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productosFiltrados.map((product) => (
                    <ProductCard key={product.id} product={product} onVerMas={setSelectedProduct} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}
