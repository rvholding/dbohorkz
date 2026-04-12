import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image_url: product.image_url, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return removeItem(productId);
    setItems(prev => prev.map(i => i.id === productId ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const checkoutWhatsApp = useCallback(() => {
    if (items.length === 0) return;
    const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
    let msg = 'Hola, quiero hacer un pedido:\n\n';
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} x${item.qty} — ${fmt(item.price * item.qty)}\n`;
    });
    msg += `\n*Total: ${fmt(totalPrice)}*`;
    msg += '\n\nQuedo atento a la confirmación.';
    window.open(`https://wa.me/573142187098?text=${encodeURIComponent(msg)}`, '_blank');
  }, [items, totalPrice]);

  return (
    <CartContext.Provider value={{ items, isOpen, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, openCart, closeCart, checkoutWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
}
