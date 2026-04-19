import React, { createContext, useContext, useState, useCallback } from 'react';
import { ordersAPI } from '../services/api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

// Clave única por variante (mismo producto con talla/color diferente = item separado)
const variantKey = (id, size = '', color = '') => `${id}-${size}-${color}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const addItem = useCallback((product, variant = {}) => {
    const size = variant.size || '';
    const color = variant.color || '';
    const key = variantKey(product.id, size, color);

    setOrderNumber(null);
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        size,
        color,
        qty: 1,
      }];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty < 1) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
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

    const variantLabel = (item) => {
      const parts = [];
      if (item.size) parts.push(`Talla ${item.size}`);
      if (item.color) parts.push(`Color ${item.color}`);
      return parts.length ? ` (${parts.join(', ')})` : '';
    };

    try {
      const res = await ordersAPI.create({
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        items: items.map(i => ({
          product_id: i.id,
          product_name: i.name,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
        })),
      });

      const order = res.data.order;
      setOrderNumber(order.order_number);

      let msg = `Hola, quiero hacer un pedido:\n\n`;
      msg += `*Pedido: ${order.order_number}*\n`;
      if (customerName) msg += `Nombre: ${customerName}\n`;
      msg += `\n`;
      items.forEach((item, i) => {
        msg += `${i + 1}. ${item.name}${variantLabel(item)} x${item.qty} — ${fmt(item.price * item.qty)}\n`;
      });
      msg += `\n*Total: ${fmt(totalPrice)}*`;
      msg += '\n\nQuedo atento a la confirmación.';

      window.open(`https://wa.me/573142187098?text=${encodeURIComponent(msg)}`, '_blank');
      setItems([]);
    } catch {
      let msg = 'Hola, quiero hacer un pedido:\n\n';
      items.forEach((item, i) => {
        msg += `${i + 1}. ${item.name}${variantLabel(item)} x${item.qty} — ${fmt(item.price * item.qty)}\n`;
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
