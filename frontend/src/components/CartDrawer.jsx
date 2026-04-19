import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { imageUrl } from '../services/api';

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, clearCart, totalItems, totalPrice, checkoutWhatsApp, orderNumber, checkingOut } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  function handleCheckout() {
    checkoutWhatsApp(name, phone);
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[90vw] max-w-lg bg-white z-[70] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-navy text-white">
          <h2 className="font-bold text-lg">
            Mi Carrito
            {totalItems > 0 && <span className="ml-2 text-gold text-sm">({totalItems})</span>}
          </h2>
          <button onClick={closeCart} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Pedido confirmado */}
        {orderNumber && items.length === 0 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-bold text-navy text-lg mb-1">Pedido enviado</h3>
            <p className="text-gray-500 text-sm mb-3">Tu numero de pedido es:</p>
            <div className="bg-navy/5 border-2 border-navy rounded-xl py-3 px-4 inline-block">
              <span className="font-bold text-navy text-xl tracking-wider">{orderNumber}</span>
            </div>
            <p className="text-gray-400 text-xs mt-4">Guarda este numero como referencia</p>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.key} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border flex-shrink-0">
                    {item.image_url ? (
                      <img src={imageUrl(item.image_url)} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin img</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-navy text-sm truncate">{item.name}</h4>
                    {(item.size || item.color) && (
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {item.size && <span className="text-xs bg-navy/10 text-navy px-1.5 py-0.5 rounded">Talla: {item.size}</span>}
                        {item.color && <span className="text-xs bg-navy/10 text-navy px-1.5 py-0.5 rounded">Color: {item.color}</span>}
                      </div>
                    )}
                    <p className="text-gold-dark font-bold text-sm mt-0.5">{fmt(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.key, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100">−</button>
                      <span className="font-semibold text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.key, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.key)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                    <span className="text-navy font-bold text-sm">{fmt(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carrito vacío (sin pedido reciente) */}
        {items.length === 0 && !orderNumber && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <p className="font-semibold text-lg">Tu carrito esta vacio</p>
            <p className="text-sm mt-1">Agrega productos para empezar</p>
          </div>
        )}

        {/* Footer con checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {/* Datos del cliente */}
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
              <input type="tel" placeholder="Tu celular" value={phone} onChange={e => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Total:</span>
              <span className="text-navy font-bold text-xl">{fmt(totalPrice)}</span>
            </div>

            {/* Checkout WhatsApp */}
            <button onClick={handleCheckout} disabled={checkingOut}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.544l-.378-.227-2.648.887.887-2.648-.227-.378A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {checkingOut ? 'Procesando...' : 'Enviar pedido por WhatsApp'}
            </button>

            <button onClick={clearCart} className="w-full text-gray-400 text-xs hover:text-red-500 transition-colors">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
