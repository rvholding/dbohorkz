import React, { useState } from 'react';
import { chatbotAPI } from '../services/api';

const INFO = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    titulo: 'Teléfono',
    valor: '314 218 70 98',
    href: 'tel:3142187098',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.855L0 24l6.29-1.501A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.021-1.378l-.36-.214-3.733.891.937-3.618-.235-.372A9.788 9.788 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/>
      </svg>
    ),
    titulo: 'WhatsApp',
    valor: 'Escríbenos por WhatsApp',
    href: 'https://wa.me/573142187098',
    externo: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    titulo: 'Dirección',
    valor: 'Av. 39 Diagonal 44-52, Las Vegas, Bello',
  },
];

export default function ContactoSection() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await chatbotAPI.sendMessage(
        `Consulta de ${form.nombre} (${form.email}): ${form.mensaje}`,
        null, 'web'
      );
      setStatus('success');
      setForm({ nombre: '', email: '', mensaje: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-20 bg-navy" id="contacto">
      <div className="container mx-auto px-6">

        {/* Encabezado */}
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Estamos para servirte</p>
          <h2 className="text-4xl font-bold text-white">Contáctanos</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Info de contacto */}
          <div className="flex flex-col gap-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Somos <span className="text-gold font-semibold">dbohorkz Intendencia Militar</span>, tu proveedor de confianza en dotación oficial para el INPEC. Escríbenos y te atendemos de inmediato.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {INFO.map(({ icon, titulo, valor, href, externo }) => (
                <div key={titulo} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:border-gold/40 transition-colors">
                  <div className="text-gold flex-shrink-0">{icon}</div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{titulo}</p>
                    {href ? (
                      <a href={href} target={externo ? '_blank' : undefined} rel={externo ? 'noreferrer' : undefined}
                        className="text-white font-semibold hover:text-gold transition-colors text-sm">
                        {valor}
                      </a>
                    ) : (
                      <p className="text-white font-semibold text-sm">{valor}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón WhatsApp destacado */}
            <a href="https://wa.me/573142187098" target="_blank" rel="noreferrer"
              className="mt-2 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg text-sm uppercase tracking-wide">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.524 5.855L0 24l6.29-1.501A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.021-1.378l-.36-.214-3.733.891.937-3.618-.235-.372A9.788 9.788 0 012.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z"/>
              </svg>
              Chatear por WhatsApp
            </a>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
            <h3 className="text-white font-bold text-xl mb-1">Envíanos un mensaje</h3>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium mb-1.5">Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                placeholder="Tu nombre completo" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                placeholder="correo@ejemplo.com" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium mb-1.5">Mensaje</label>
              <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none text-sm"
                placeholder="¿En qué podemos ayudarte?" />
            </div>

            {status === 'success' && (
              <div className="bg-green-500/20 border border-green-500/40 text-green-400 text-sm rounded-lg px-4 py-3">
                ¡Mensaje enviado! Te contactamos pronto.
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-400 text-sm rounded-lg px-4 py-3">
                Hubo un error. Intentá de nuevo.
              </div>
            )}

            <button type="submit" disabled={status === 'sending'}
              className="w-full bg-gold text-navy font-bold py-3 rounded-lg uppercase tracking-wide text-sm hover:bg-gold-light transition-colors duration-200 disabled:opacity-60 mt-1">
              {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
