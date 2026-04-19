import React, { useState, useEffect } from 'react';
import { customersAPI } from '../../services/api';

const EMPTY_CUSTOMER = { username: '', password: '', apellidos: '', nombres: '', celular: '', active: true };

export default function ClientesTab({ showMensaje }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_CUSTOMER);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    customersAPI.getAll()
      .then(res => setCustomers(res.data.customers || []))
      .finally(() => setLoading(false));
  }

  function startNew() {
    setEditingId(null);
    setForm(EMPTY_CUSTOMER);
    setShowForm(true);
  }

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ username: c.username, password: '', apellidos: c.apellidos, nombres: c.nombres, celular: c.celular, active: c.active });
    setShowForm(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const payload = { apellidos: form.apellidos, nombres: form.nombres, celular: form.celular, active: form.active };
        if (form.password) payload.password = form.password;
        await customersAPI.update(editingId, payload);
        showMensaje('Cliente actualizado');
      } else {
        if (!form.username || !form.password || !form.apellidos || !form.nombres) {
          showMensaje('Completa todos los campos', true);
          setSaving(false);
          return;
        }
        await customersAPI.create(form);
        showMensaje('Cliente creado');
      }
      setShowForm(false);
      setForm(EMPTY_CUSTOMER);
      setEditingId(null);
      load();
    } catch (err) {
      showMensaje(err.response?.data?.error || 'Error al guardar', true);
    } finally {
      setSaving(false);
    }
  }

  async function remove(c) {
    if (!window.confirm(`¿Eliminar cliente "${c.username}"?`)) return;
    try {
      await customersAPI.remove(c.id);
      showMensaje('Cliente eliminado');
      load();
    } catch {
      showMensaje('Error al eliminar', true);
    }
  }

  async function toggleActive(c) {
    try {
      await customersAPI.update(c.id, { active: !c.active });
      load();
    } catch {
      showMensaje('Error', true);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Clientes Preferenciales</h2>
          <p className="text-sm text-gray-500">Cuentas para acceder al portal /cliente</p>
        </div>
        {!showForm && (
          <button onClick={startNew}
            className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-gold-dark text-sm">
            + Nuevo cliente
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl shadow p-5 mb-6 space-y-3">
          <h3 className="font-bold text-navy">{editingId ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Usuario *</label>
              <input type="text" value={form.username} disabled={!!editingId}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Contraseña {editingId && '(dejar vacío para no cambiar)'}</label>
              <input type="password" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required={!editingId} minLength={6} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Apellidos *</label>
              <input type="text" value={form.apellidos}
                onChange={e => setForm(p => ({ ...p, apellidos: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Nombres *</label>
              <input type="text" value={form.nombres}
                onChange={e => setForm(p => ({ ...p, nombres: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Celular</label>
              <input type="tel" value={form.celular}
                onChange={e => setForm(p => ({ ...p, celular: e.target.value }))}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4 accent-gold" />
                Activo
              </label>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_CUSTOMER); setEditingId(null); }}
              className="flex-1 border border-gray-300 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50 text-sm">Cancelar</button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gold text-navy font-bold py-2 rounded-lg hover:bg-gold-dark text-sm disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
        </div>
      ) : customers.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Aún no hay clientes. Agrega el primero.</p>
      ) : (
        <div className="space-y-2">
          {customers.map(c => (
            <div key={c.id} className={`bg-white rounded-xl shadow p-4 ${!c.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy">{c.apellidos} {c.nombres}</h3>
                  <p className="text-sm text-gray-500">Usuario: <strong>{c.username}</strong> {c.celular && `· ${c.celular}`}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(c)}
                    className={`text-xs font-bold px-3 py-1.5 rounded ${c.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {c.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => startEdit(c)}
                    className="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded">
                    Editar
                  </button>
                  <button onClick={() => remove(c)}
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
