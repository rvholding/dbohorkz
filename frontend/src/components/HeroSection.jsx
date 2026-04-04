import React, { useState, useEffect } from 'react';

const IMAGES = [
  '/Images/principal.jpeg',
  '/Images/Principal2.jpeg',
  '/Images/Principal3.jpeg',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-navy to-navy-light py-20" id="hero">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Identidad y Excelencia
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gold uppercase tracking-widest mb-6">
            Para el Cuerpo de Custodia y Vigilancia
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Dotación oficial con precisión heráldica y calidad táctica superior para el personal del INPEC.
          </p>
          <a
            href="#productos"
            className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded shadow-lg hover:bg-gold-light transition-colors duration-200 tracking-wide uppercase text-sm"
          >
            Explorar Catálogo
          </a>
        </div>

        <div className="md:w-1/2 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-lg h-96 md:h-[28rem]">
            <div className="absolute inset-0 bg-gold opacity-10 rounded-2xl blur-2xl"></div>
            {IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Imagen ${i + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-gold border-opacity-30 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          {/* Puntos */}
          <div className="flex justify-center gap-2">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6 h-2.5' : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
