import axios from 'axios';

// Cliente HTTP base — apunta al backend Flask
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: adjunta el token JWT a cada request si el admin está logueado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el token expiró, limpiar sesión y redirigir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      if (window.location.pathname === '/admin') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// ─── API de Productos ──────────────────────────────────────────────────────────
export const productosAPI = {
  getAll: (page = 1, perPage = 20) =>
    api.get('/api/products/', { params: { page, per_page: perPage } }),
  getOne: (id)   => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products/', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  remove: (id)   => api.delete(`/api/products/${id}`),
};

// ─── API de Autenticación ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
};

// ─── API del Chatbot / Contacto ───────────────────────────────────────────────
export const chatbotAPI = {
  // Envía un mensaje al chatbot; también dispara la notificación de correo al admin
  sendMessage: (message, userId = null, platform = 'web') =>
    api.post('/api/chatbot/message', { message, user_id: userId, platform }),
  getFaq: () => api.get('/api/chatbot/faq'),
};

export default api;
