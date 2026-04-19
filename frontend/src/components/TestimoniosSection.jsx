import React, { useEffect, useState } from 'react';
import { testimonialsAPI } from '../services/api';

const LS_KEY = 'dbohorkz_rated';

function Stars({ rating, size = 'w-5 h-5' }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${size} ${i <= rating ? 'text-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimoniosSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    testimonialsAPI.getAll()
      .then(res => setTestimonials(res.data.testimonials || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));

    if (localStorage.getItem(LS_KEY)) setAlreadyRated(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1) {
      setError('Por favor selecciona de 1 a 5 estrellas');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await testimonialsAPI.create({
        customer_name: name.trim() || 'Anónimo',
        rating,
        comment: comment.trim(),
      });
      setTestimonials(prev => [res.data.testimonial, ...prev]);
      localStorage.setItem(LS_KEY, new Date().toISOString());
      setAlreadyRated(true);
      setSuccess(true);
      setRating(0);
      setName('');
      setComment('');
    } catch (err) {
      const msg = err?.response?.status === 429
        ? 'Demasiados intentos. Intenta más tarde.'
        : 'No se pudo enviar tu calificación. Intenta más tarde.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const totalRatings = testimonials.length;
  const avgRating = totalRatings > 0
    ? testimonials.reduce((s, t) => s + t.rating, 0) / totalRatings
    : 0;

  return (
    <section className="py-16 bg-gradient-to-br from-navy to-navy-light" id="testimonios">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Califícanos</p>
          <h2 className="text-3xl font-bold text-white">Tu opinión importa</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>
        </div>

        {/* Resumen */}
        {totalRatings > 0 && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl font-bold text-gold">{avgRating.toFixed(1)}</span>
              <span className="text-gray-300 text-lg">/ 5</span>
            </div>
            <div className="flex justify-center mb-2">
              <Stars rating={Math.round(avgRating)} size="w-6 h-6" />
            </div>
            <p className="text-gray-300 text-sm">{totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'}</p>
          </div>
        )}

        {/* Formulario */}
        {!alreadyRated && !success && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="font-bold text-navy text-lg mb-4 text-center">Deja tu calificación</h3>

            {/* Estrellas interactivas */}
            <div className="flex justify-center gap-1 mb-5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg className={`w-10 h-10 ${n <= (hoverRating || rating) ? 'text-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={100}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <textarea
                rows={3}
                placeholder="Comentario (opcional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting || rating < 1}
              className="w-full mt-4 bg-gold text-navy font-bold py-3 rounded-lg hover:bg-gold/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar calificación'}
            </button>
          </form>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-2xl p-5 mb-8 text-center">
            <svg className="w-10 h-10 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-white font-semibold">¡Gracias por tu calificación!</p>
          </div>
        )}

        {alreadyRated && !success && (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 mb-8 text-center">
            <p className="text-gray-300 text-sm">Ya calificaste este sitio. ¡Gracias por tu opinión!</p>
          </div>
        )}

        {/* Lista de comentarios */}
        {!loading && testimonials.length > 0 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-4 text-center">Comentarios recientes</h3>
            <div className="space-y-3">
              {testimonials.slice(0, 10).map(t => (
                <div key={t.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">{t.customer_name}</span>
                    <Stars rating={t.rating} size="w-4 h-4" />
                  </div>
                  {t.comment && <p className="text-gray-300 text-sm italic">"{t.comment}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
