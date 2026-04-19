import React, { useEffect, useState } from 'react';
import { testimonialsAPI, imageUrl } from '../services/api';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-5 h-5 ${i <= rating ? 'text-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimoniosSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsAPI.getAll()
      .then(res => setTestimonials(res.data.testimonials || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || testimonials.length === 0) return null;

  const avgRating = testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length;

  return (
    <section className="py-16 bg-gradient-to-br from-navy to-navy-light" id="testimonios">
      <div className="container mx-auto px-6">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-widest text-sm font-semibold mb-2">Lo que dicen nuestros clientes</p>
          <h2 className="text-3xl font-bold text-white">Testimonios</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded"></div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-white font-semibold">{avgRating.toFixed(1)} / 5</span>
            <span className="text-gray-300 text-sm">· {testimonials.length} opiniones</span>
          </div>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              {t.image_url && (
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <img src={imageUrl(t.image_url)} alt={`Felicitación de ${t.customer_name}`}
                    className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <Stars rating={t.rating} />
                {t.comment && (
                  <p className="text-gray-600 italic mt-3 flex-1">"{t.comment}"</p>
                )}
                <p className="text-navy font-bold mt-4">— {t.customer_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
