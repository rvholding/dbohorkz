import React from 'react';

export default function NosotrosSection() {
  return (
    <section className="py-16 bg-white" id="nosotros">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Quiénes somos</p>
          <h2 className="text-3xl font-bold text-navy">Nosotros</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        <p className="text-gray-600 text-center text-lg leading-relaxed mb-12">
          Somos <strong className="text-navy">dbohorkz Intendencia Militar</strong>, una empresa especializada en la
          fabricación y distribución de uniformes penitenciarios de alta calidad. Trabajamos con instituciones
          de seguridad de todo el país, garantizando resistencia, comodidad y cumplimiento de las normativas vigentes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { value: '10+', label: 'Años de experiencia' },
            { value: '500+', label: 'Clientes satisfechos' },
            { value: '100%', label: 'Fabricación nacional' },
          ].map(({ value, label }) => (
            <div key={label} className="border border-gold border-opacity-30 rounded-xl p-6 bg-gradient-to-br from-white to-yellow-50">
              <div className="text-4xl font-bold text-gold mb-2">{value}</div>
              <div className="text-navy font-medium text-sm uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
