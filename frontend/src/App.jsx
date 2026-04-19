import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import ClientePage from './pages/ClientePage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cliente" element={<ClientePage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
