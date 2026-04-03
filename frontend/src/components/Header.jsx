import React, { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <img src="/Images/logo.png" alt="Intendencia" className="h-28 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col leading-tight">
            <span
              className="text-gold tracking-widest animate-fadeinout"
              style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 900, fontVariant: 'normal', textTransform: 'none' }}
            >
              Dbohorkz Intendencia para el INPEC
            </span>
            <span
              className="text-gold-light tracking-wider opacity-80"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '1rem', fontWeight: 500 }}
            >
              dbohorkz · 314 218 70 98
            </span>
          </div>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
            <a
              key={item}
              href={item === 'Inicio' ? '/' : `#${item.toLowerCase()}`}
              className="text-white hover:text-gold font-medium transition-colors duration-200 text-sm tracking-wide uppercase"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-gold focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Nav mobile */}
      {menuOpen && (
        <div className="md:hidden bg-navy-light px-6 pb-4 space-y-3">
          {['Inicio', 'Productos', 'Nosotros', 'Contacto'].map((item) => (
            <a
              key={item}
              href={item === 'Inicio' ? '/' : `#${item.toLowerCase()}`}
              className="block text-white hover:text-gold font-medium transition uppercase text-sm tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
