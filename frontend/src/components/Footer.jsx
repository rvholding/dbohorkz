import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Cuerpo principal */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + mapa */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="/Images/logo.png" alt="Intendencia Militar" className="h-28 w-auto"
              onError={e => e.target.style.display = 'none'} />
            <div>
              <div className="font-bold text-gold tracking-widest uppercase text-base">dbohorkz Intendencia Militar</div>
              <div className="text-xs text-gray-400">314 218 70 98</div>
            </div>
          </div>
          <iframe
            title="Ubicación"
            src="https://maps.google.com/maps?q=Avenida+39+diagonal+44+52+Las+Vegas+Bello+Colombia&output=embed"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: '0.75rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Navegación */}
        <div>
          <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Navegación</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Productos', href: '#productos' },
              { label: 'Nosotros', href: '#nosotros' },
              { label: 'Contacto', href: '#contacto' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hover:text-gold transition-colors duration-200">{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Av. 39 Diagonal 44-52, Las Vegas, Bello — Colombia</span>
            </li>
            <li>
              <a href="tel:3142187098" className="hover:text-gold transition-colors flex items-center gap-2">
                <span>📞</span> 314 218 70 98
              </a>
            </li>
            <li>
              <a href="https://wa.me/573142187098" target="_blank" rel="noreferrer"
                className="hover:text-gold transition-colors flex items-center gap-2">
                <span>💬</span> WhatsApp
              </a>
            </li>
          </ul>

          {/* Redes sociales */}
          <div className="mt-6">
            <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-3">Síguenos</h4>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=100090906836440" target="_blank" rel="noreferrer"
                className="bg-white/10 hover:bg-gold hover:text-navy text-white p-2 rounded-lg transition-all duration-200"
                title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/dbohorkz4/" target="_blank" rel="noreferrer"
                className="bg-white/10 hover:bg-gold hover:text-navy text-white p-2 rounded-lg transition-all duration-200"
                title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white border-opacity-10 py-4">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} dbohorkz Intendencia Militar. Todos los derechos reservados.</span>
          <span>Elementos de Intendencia Militar para el INPEC</span>
        </div>
      </div>
    </footer>
  );
}
