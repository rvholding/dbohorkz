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
