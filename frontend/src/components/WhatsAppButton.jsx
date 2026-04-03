import React, { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    const tipTimer = setTimeout(() => setTooltip(false), 5000);
    return () => { clearTimeout(timer); clearTimeout(tipTimer); };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Tooltip */}
      {tooltip && (
        <div className="bg-white text-navy text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap animate-pulse">
          ¡Escríbenos por WhatsApp!
        </div>
      )}

      {/* Botón */}
      <a
        href="https://wa.me/573142187098?text=Hola,%20me%20interesa%20información%20sobre%20sus%20productos%20de%20intendencia."
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110"
        aria-label="Contactar por WhatsApp"
        onClick={() => setTooltip(false)}
      >
        {/* Pulso */}
        <span className="absolute w-14 h-14 rounded-full bg-green-400 animate-ping opacity-30"></span>
        <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.855L0 24l6.29-1.501A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.021-1.378l-.36-.214-3.733.891.937-3.618-.235-.372A9.788 9.788 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/>
        </svg>
      </a>
    </div>
  );
}
