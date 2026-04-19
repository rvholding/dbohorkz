import React, { useState, useEffect, useMemo } from 'react';
import { customerAuthAPI, catalogAPI, preferencialOrdersAPI } from '../services/api';

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

// Calcula el precio final de una línea con sus selecciones de opciones
function calcItemPrice(item, selections) {
  let price = item.base_price;
  for (const opt of item.options || []) {
    if (opt.type === 'addon' && selections?.addons?.[opt.label]) {
      price += Number(opt.price || 0);
    }
  }
  return price;
}

// Genera un resumen legible de las selecciones para mostrar y enviar
function selectionsSummary(item, selections) {
  const parts = [];
  for (const opt of item.options || []) {
    if (opt.type === 'size' && selections?.size) parts.push(`Talla ${selections.size}`);
    if (opt.type === 'color' && selections?.color) parts.push(`Bordado ${selections.color}`);
    if (opt.type === 'addon' && selections?.addons?.[opt.label]) parts.push(opt.label);
  }
  return parts.join(' · ');
}

export default function ClientePage() {
  const [token, setToken] = useState(localStorage.getItem('customerToken') || '');
  const [customer, setCustomer] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [selections, setSelections] = useState({});  // { itemId: { qty, size, color, addons:{} } }
  const [contingente, setContingente] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  // Validar token al cargar
  useEffect(() => {
    if (!token) return;
    customerAuthAPI.me()
      .then(res => setCustomer(res.data.customer))
      .catch(() => {
        localStorage.removeItem('customerToken');
        setToken('');
      });
  }, [token]);

  // Cargar catálogo cuando hay cliente logueado
  useEffect(() => {
    if (!customer) return;
    setLoadingCatalog(true);
    catalogAPI.list()
      .then(res => setCatalog(res.data.items || []))
      .catch(() => setError('No se pudo cargar el catálogo'))
      .finally(() => setLoadingCatalog(false));
  }, [customer]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await customerAuthAPI.login(loginData);
      localStorage.setItem('customerToken', res.data.token);
      setToken(res.data.token);
      setCustomer(res.data.customer);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('customerToken');
    setToken('');
    setCustomer(null);
    setCatalog([]);
    setSelections({});
    setOrderResult(null);
  }

  function updateSel(itemId, key, value) {
    setSelections(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [key]: value },
    }));
  }

  function toggleAddon(itemId, label) {
    setSelections(prev => {
      const current = prev[itemId] || {};
      const addons = { ...(current.addons || {}), [label]: !current.addons?.[label] };
      return { ...prev, [itemId]: { ...current, addons } };
    });
  }

  const orderLines = useMemo(() => {
    return catalog
      .map(item => {
        const sel = selections[item.id];
        const qty = parseInt(sel?.qty, 10) || 0;
        if (qty < 1) return null;
        const unitPrice = calcItemPrice(item, sel);
        const summary = selectionsSummary(item, sel);
        return {
          item,
          qty,
          unitPrice,
          summary,
          subtotal: unitPrice * qty,
          size: sel?.size || '',
          color: sel?.color || '',
        };
      })
      .filter(Boolean);
  }, [catalog, selections]);

  const total = orderLines.reduce((s, l) => s + l.subtotal, 0);

  async function handleSubmit() {
    setError('');
    if (orderLines.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }
    // Validar opciones requeridas (talla/color si el item las tiene)
    for (const line of orderLines) {
      for (const opt of line.item.options || []) {
        if (opt.type === 'size' && !line.size) {
          setError(`Selecciona talla para "${line.item.name}"`);
          return;
        }
        if (opt.type === 'color' && !line.color) {
          setError(`Selecciona color de bordado para "${line.item.name}"`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await preferencialOrdersAPI.create({
        contingente,
        items: orderLines.map(l => ({
          product_name: l.summary ? `${l.item.name} (${l.summary})` : l.item.name,
          price: l.unitPrice,
          qty: l.qty,
          size: l.size,
          color: l.color,
        })),
      });
      setOrderResult(res.data.order);
      setSelections({});
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el pedido');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Pantalla de login ───────────────────────────────────────────
  if (!customer) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="/Images/logo.png" alt="Logo" className="h-20 mx-auto mb-3"
              onError={e => e.target.style.display = 'none'} />
            <h1 className="text-2xl font-bold text-navy">Portal Cliente</h1>
            <p className="text-sm text-gray-500 mt-1">Accede con tus credenciales</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input type="text" value={loginData.username}
                onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                required autoComplete="username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={loginData.password}
                onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                required autoComplete="current-password" />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" disabled={loggingIn}
              className="w-full bg-gold text-navy font-bold py-2 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
              {loggingIn ? 'Ingresando...' : 'Ingresar'}
            </button>
            <p className="text-xs text-gray-400 text-center">Tu acceso es personal. No lo compartas.</p>
          </form>
        </div>
      </div>
    );
  }

  // ── Pantalla de confirmación de pedido ──────────────────────────
  if (orderResult) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-navy text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Images/logo.png" alt="Logo" className="h-10 w-auto" onError={e => e.target.style.display = 'none'} />
            <div>
              <div className="font-bold text-gold tracking-widest uppercase text-sm">Portal Cliente</div>
              <div className="text-xs text-gray-400">{customer.nombres} {customer.apellidos}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-gold">Salir</button>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-bold text-navy text-xl mb-2">¡Pedido enviado!</h2>
            <p className="text-gray-500 text-sm mb-4">Tu número de referencia es:</p>
            <div className="bg-navy/5 border-2 border-navy rounded-xl py-3 px-4 mb-4">
              <span className="font-bold text-navy text-2xl tracking-wider">{orderResult.order_number}</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Total: <strong>{fmt(orderResult.total)}</strong></p>
            <button onClick={() => setOrderResult(null)}
              className="w-full bg-gold text-navy font-bold py-3 rounded-lg hover:bg-gold-dark transition-colors">
              Hacer otro pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario principal ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-navy text-white px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/Images/logo.png" alt="Logo" className="h-10 w-auto" onError={e => e.target.style.display = 'none'} />
          <div>
            <div className="font-bold text-gold tracking-widest uppercase text-sm">Portal Cliente</div>
            <div className="text-xs text-gray-400">{customer.nombres} {customer.apellidos}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-gold">Salir</button>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl pb-36">
        {/* Contingente */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Número de contingente</label>
          <input type="text" value={contingente} onChange={e => setContingente(e.target.value)}
            placeholder="Ej: 4/2025"
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
        </div>

        {loadingCatalog ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
        ) : catalog.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            El catálogo aún no tiene productos.
          </div>
        ) : (
          <div className="space-y-3">
            {catalog.map(item => {
              const sel = selections[item.id] || {};
              const qty = parseInt(sel.qty, 10) || 0;
              const unitPrice = calcItemPrice(item, sel);
              const hasOptions = (item.options || []).length > 0;

              return (
                <div key={item.id} className={`bg-white rounded-xl shadow p-4 ${qty > 0 ? 'ring-2 ring-gold' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy">{item.name}</h3>
                      {item.description && <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{item.description}</p>}
                      <p className="text-gold-dark font-bold text-lg mt-1">{fmt(unitPrice)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => updateSel(item.id, 'qty', Math.max(0, qty - 1))}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">−</button>
                      <input type="number" min="0" value={qty || ''}
                        onChange={e => updateSel(item.id, 'qty', parseInt(e.target.value, 10) || 0)}
                        className="w-14 h-9 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold" />
                      <button onClick={() => updateSel(item.id, 'qty', qty + 1)}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">+</button>
                    </div>
                  </div>

                  {/* Opciones (solo si hay cantidad > 0) */}
                  {qty > 0 && hasOptions && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      {item.options.map((opt, idx) => {
                        if (opt.type === 'size') {
                          return (
                            <div key={idx}>
                              <label className="text-xs font-bold text-gray-500 uppercase">Talla</label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {opt.values.map(v => (
                                  <button key={v} onClick={() => updateSel(item.id, 'size', v)}
                                    className={`px-3 py-1.5 rounded border-2 text-sm font-semibold ${sel.size === v ? 'bg-navy text-gold border-navy' : 'bg-white text-navy border-gray-300 hover:border-gold'}`}>
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (opt.type === 'color') {
                          return (
                            <div key={idx}>
                              <label className="text-xs font-bold text-gray-500 uppercase">Color de bordado</label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {opt.values.map(v => (
                                  <button key={v} onClick={() => updateSel(item.id, 'color', v)}
                                    className={`px-3 py-1.5 rounded border-2 text-sm font-semibold ${sel.color === v ? 'bg-navy text-gold border-navy' : 'bg-white text-navy border-gray-300 hover:border-gold'}`}>
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (opt.type === 'addon') {
                          const checked = !!sel.addons?.[opt.label];
                          return (
                            <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                              <input type="checkbox" checked={checked}
                                onChange={() => toggleAddon(item.id, opt.label)}
                                className="w-4 h-4 accent-gold" />
                              <span>{opt.label}</span>
                              <span className="text-gold-dark font-bold">+{fmt(opt.price)}</span>
                            </label>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {qty > 0 && (
                    <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
                      <span className="text-gray-500">Subtotal ({qty} x {fmt(unitPrice)})</span>
                      <span className="font-bold text-navy">{fmt(unitPrice * qty)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Barra inferior fija con total y botón enviar */}
      {orderLines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-30">
          <div className="container mx-auto px-4 py-3 max-w-5xl">
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold">Total ({orderLines.length} {orderLines.length === 1 ? 'producto' : 'productos'})</div>
                <div className="text-2xl font-bold text-navy">{fmt(total)}</div>
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {submitting ? 'Enviando...' : 'Enviar pedido'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
