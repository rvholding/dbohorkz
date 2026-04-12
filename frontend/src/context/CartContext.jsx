import React, { createContext, useContext, useState, useCallback } from 'react';
import { ordersAPI } from '../services/api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const addItem = useCallback((product) => {
    setOrderNumber(null);
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

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderNumber(null);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const checkoutWhatsApp = useCallback(async (customerName, customerPhone) => {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);

    try {
      // Crear pedido en la base de datos
      const res = await ordersAPI.create({
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        items: items.map(i => ({
          product_id: i.id,
          product_name: i.name,
          price: i.price,
          qty: i.qty,
        })),
      });

      const order = res.data.order;
      setOrderNumber(order.order_number);

      // Generar mensaje de WhatsApp con número de pedido
      let msg = `Hola, quiero hacer un pedido:\n\n`;
      msg += `*Pedido: ${order.order_number}*\n`;
      if (customerName) msg += `Nombre: ${customerName}\n`;
      msg += `\n`;
      items.forEach((item, i) => {
        msg += `${i + 1}. ${item.name} x${item.qty} — ${fmt(item.price * item.qty)}\n`;
      });
      msg += `\n*Total: ${fmt(totalPrice)}*`;
      msg += '\n\nQuedo atento a la confirmación.';

      window.open(`https://wa.me/573142187098?text=${encodeURIComponent(msg)}`, '_blank');
      setItems([]);
    } catch {
      // Si falla la API, enviar sin número de pedido
      let msg = 'Hola, quiero hacer un pedido:\n\n';
      items.forEach((item, i) => {
        msg += `${i + 1}. ${item.name} x${item.qty} — ${fmt(item.price * item.qty)}\n`;
      });
      msg += `\n*Total: ${fmt(totalPrice)}*`;
      msg += '\n\nQuedo atento a la confirmación.';
      window.open(`https://wa.me/573142187098?text=${encodeURIComponent(msg)}`, '_blank');
    } finally {
      setCheckingOut(false);
    }
  }, [items, totalPrice, checkingOut]);

  return (
    <CartContext.Provider value={{ items, isOpen, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, openCart, closeCart, checkoutWhatsApp, orderNumber, checkingOut }}>
      {children}
    </CartContext.Provider>
  );
}
