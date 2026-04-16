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

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gold/30 rounded-xl p-6 bg-gradient-to-br from-white to-yellow-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy uppercase tracking-wide">Misión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Proveer al personal del INPEC de vestuario y accesorios tácticos que superen los estándares de seguridad y durabilidad. Desde 2014, nos comprometemos a entregar productos de alta calidad y bajo estricto cumplimiento normativo, garantizando precios competitivos y cobertura nacional para facilitar la labor operativa de quienes sirven al país.
            </p>
          </div>
          <div className="border border-gold/30 rounded-xl p-6 bg-gradient-to-br from-white to-yellow-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy uppercase tracking-wide">Visión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Para el año 2030, ser el referente nacional y aliado estratégico número uno del personal penitenciario en Colombia. Buscamos consolidar a DBOHORKZ como la marca líder en innovación táctica, reconocida por la eficiencia en sus envíos y por dignificar la labor operativa a través de dotaciones de excelencia.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
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
