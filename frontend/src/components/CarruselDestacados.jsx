import React, { useState, useEffect } from 'react';

const slides = [
  {
    icon: (
      <svg className="w-14 h-14 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    titulo: 'Precisión Heráldica',
    subtitulo: 'Bordados exactos según la norma.',
    detalle: 'Cada escudo, jineta y distintivo es reproducido con fidelidad técnica, cumpliendo las especificaciones oficiales del INPEC.',
    color: 'from-navy to-navy-light',
  },
  {
    icon: (
      <svg className="w-14 h-14 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
      </svg>
    ),
    titulo: 'Calidad Táctica',
    subtitulo: 'Materiales de alta resistencia.',
    detalle: 'Telas, cueros y polímeros seleccionados para soportar las exigencias del servicio penitenciario en cualquier condición.',
    color: 'from-navy-light to-navy',
  },
  {
    icon: (
      <svg className="w-14 h-14 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    titulo: 'Entrega Ágil',
    subtitulo: 'Logística optimizada a nivel nacional.',
    detalle: 'Despachos inmediatos a todo el país. Tu dotación llega a tiempo, donde la necesitas.',
    color: 'from-navy to-navy-light',
  },
];

export default function CarruselDestacados() {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivo(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 overflow-hidden border-t-4 border-gold" style={{ backgroundColor: '#111627' }}>
      <div className="container mx-auto px-6">
        {/* Título */}
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">Por qué elegirnos</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Nuestros compromisos</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        {/* Carrusel */}
        <div className="relative max-w-3xl mx-auto">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${i === activo ? 'opacity-100 translate-y-0' : 'opacity-0 absolute inset-0 translate-y-4 pointer-events-none'}`}
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 border border-gold border-opacity-20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                {/* Icono */}
                <div className="flex-shrink-0 bg-gold bg-opacity-10 rounded-full p-6">
                  {slide.icon}
                </div>
                {/* Texto */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gold mb-1">{slide.titulo}</h3>
                  <p className="text-white font-semibold text-lg mb-3">{slide.subtitulo}</p>
                  <p className="text-gray-300 leading-relaxed">{slide.detalle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Puntos de navegación */}
        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivo(i)}
              className={`rounded-full transition-all duration-300 ${i === activo ? 'bg-gold w-8 h-3' : 'bg-white bg-opacity-30 w-3 h-3 hover:bg-opacity-60'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Cards estáticas en desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setActivo(i)}
              className={`text-left rounded-xl p-5 border transition-all duration-300 cursor-pointer ${i === activo ? 'border-gold bg-white/10' : 'border-white/10 bg-white/5 hover:border-gold/50'}`}
            >
              <div className="mb-3 scale-75 origin-left">{slide.icon}</div>
              <h4 className="text-gold font-bold text-sm uppercase tracking-wide mb-1">{slide.titulo}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{slide.subtitulo}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
