import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CarruselDestacados from '../components/CarruselDestacados';
import ProductsSection from '../components/ProductsSection';
import NosotrosSection from '../components/NosotrosSection';
import TestimoniosSection from '../components/TestimoniosSection';
import ContactoSection from '../components/ContactoSection';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

/**
 * Página principal del sitio.
 * Compone todas las secciones en orden vertical:
 * Header → Hero → Carrusel → Productos → Nosotros → Contacto → Footer
 * WhatsAppButton flota fijo sobre todo el contenido.
 */
export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <CarruselDestacados />
        <ProductsSection />
        <NosotrosSection />
        <TestimoniosSection />
        <ContactoSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
