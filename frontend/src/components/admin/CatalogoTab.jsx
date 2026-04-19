import React, { useState, useEffect } from 'react';
import { catalogAPI } from '../../services/api';

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0);

const EMPTY_ITEM = { name: '', description: '', base_price: '', position: 0, active: true, options: [] };

function OptionEditor({ options, onChange }) {
  function addOption(type) {
    const newOpt = type === 'addon'
      ? { type: 'addon', label: '', price: 0 }
      : { type, values: [] };
    onChange([...options, newOpt]);
  }

  function removeOption(idx) {
    onChange(options.filter((_, i) => i !== idx));
  }

  function updateOption(idx, key, value) {
    const copy = [...options];
    copy[idx] = { ...copy[idx], [key]: value };
    onChange(copy);
  }

  return (
    <div className="space-y-2 mt-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded p-2">
          <span className="text-xs font-bold text-gray-600 uppercase w-20">
            {opt.type === 'size' ? 'Tallas' : opt.type === 'color' ? 'Bordado' : 'Adicional'}
          </span>
          {(opt.type === 'size' || opt.type === 'color') ? (
            <input type="text"
              value={(opt.values || []).join(', ')}
              onChange={e => updateOption(idx, 'values', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder={opt.type === 'size' ? 'S, M, L, XL' : 'Gris, Dorado, Negro'}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
          ) : (
            <>
              <input type="text" value={opt.label || ''}
                onChange={e => updateOption(idx, 'label', e.target.value)}
                placeholder="Ej: Con cremallera"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
              <input type="number" value={opt.price || ''}
                onChange={e => updateOption(idx, 'price', parseFloat(e.target.value) || 0)}
                placeholder="Precio"
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm" />
            </>
          )}
          <button type="button" onClick={() => removeOption(idx)}
            className="text-red-500 hover:text-red-700 text-lg">&times;</button>
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={() => addOption('size')}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">+ Tallas</button>
        <button type="button" onClick={() => addOption('color')}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">+ Color bordado</button>
        <button type="button" onClick={() => addOption('addon')}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">+ Adicional</button>
      </div>
    </div>
  );
}

export default function CatalogoTab({ showMensaje }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item being edited or 'new'
  const [form, setForm] = useState(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    catalogAPI.listAdmin()
      .then(res => setItems(res.data.items || []))
      .finally(() => setLoading(false));
  }

  function startEdit(item) {
    setEditing(item.id);
    setForm({ ...item, base_price: String(item.base_price) });
  }

  function startNew() {
    setEditing('new');
    setForm(EMPTY_ITEM);
  }

  function cancel() {
    setEditing(null);
    setForm(EMPTY_ITEM);
  }

  async function save() {
    if (!form.name || form.base_price === '') {
      showMensaje('Nombre y precio base son requeridos', true);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        base_price: parseFloat(form.base_price),
        position: parseInt(form.position, 10) || 0,
        active: form.active,
        options: form.options,
      };
      if (editing === 'new') {
        await catalogAPI.create(payload);
        showMensaje('Item creado');
      } else {
        await catalogAPI.update(editing, payload);
        showMensaje('Item actualizado');
      }
      cancel();
      load();
    } catch (err) {
      showMensaje(err.response?.data?.error || 'Error al guardar', true);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`¿Eliminar "${item.name}"?`)) return;
    try {
      await catalogAPI.remove(item.id);
      showMensaje('Eliminado');
      load();
    } catch {
      showMensaje('Error al eliminar', true);
    }
  }

  async function toggleActive(item) {
    try {
      await catalogAPI.update(item.id, { active: !item.active });
      load();
    } catch {
      showMensaje('Error', true);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Catálogo Preferencial</h2>
          <p className="text-sm text-gray-500">Items que los clientes ven en el portal /cliente</p>
        </div>
        {editing === null && (
          <button onClick={startNew}
            className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-gold-dark text-sm">
            + Nuevo item
          </button>
        )}
      </div>

      {/* Formulario de edición/creación */}
      {editing !== null && (
        <div className="bg-white rounded-xl shadow p-5 mb-6 space-y-3">
          <h3 className="font-bold text-navy">{editing === 'new' ? 'Nuevo item' : 'Editar item'}</h3>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
            <input type="text" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Descripción (opcional)</label>
            <textarea rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Precio base</label>
              <input type="number" value={form.base_price}
                onChange={e => setForm(p => ({ ...p, base_price: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Orden</label>
              <input type="number" value={form.position}
                onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Opciones</label>
            <OptionEditor options={form.options || []} onChange={v => setForm(p => ({ ...p, options: v }))} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={cancel}
              className="flex-1 border border-gray-300 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50 text-sm">Cancelar</button>
            <button onClick={save} disabled={saving}
              className="flex-1 bg-gold text-navy font-bold py-2 rounded-lg hover:bg-gold-dark text-sm disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Aún no hay items. Agrega el primero.</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-xl shadow p-4 ${!item.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy">{item.name}</h3>
                  <p className="text-sm text-gold-dark font-bold">{fmt(item.base_price)}</p>
                  {item.options && item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.options.map((o, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {o.type === 'size' && `Talla (${o.values?.length || 0})`}
                          {o.type === 'color' && `Bordado (${o.values?.length || 0})`}
                          {o.type === 'addon' && `${o.label} +${fmt(o.price)}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(item)}
                    className={`text-xs font-bold px-3 py-1.5 rounded ${item.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {item.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button onClick={() => startEdit(item)}
                    className="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded">
                    Editar
                  </button>
                  <button onClick={() => remove(item)}
                    className="text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
