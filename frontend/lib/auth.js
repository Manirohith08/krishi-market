import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ Attach JWT token safely (SSR safe)
api.interceptors.request.use((config) => {
  let token = null;

  if (typeof window !== 'undefined') {
    const Cookies = require('js-cookie');
    token = Cookies.get('token') || localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle 401 safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const Cookies = require('js-cookie');
        Cookies.remove('token');

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Products
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/farmer/my-products'),
};

// Cart
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (data) => api.put('/cart/update', data),
  remove: (data) => api.delete('/cart/remove', { data }),
  clear: () => api.delete('/cart/clear'),
};

// Orders
export const ordersAPI = {
  create: (data) => api.post('/orders/create', data),
  getCustomerOrders: () => api.get('/orders/customer'),
  getCustomerOrder: (id) => api.get(`/orders/customer/${id}`),
  getFarmerOrders: () => api.get('/orders/farmer'),
  updateStatus: (data) => api.put('/orders/update-status', data),
  getFarmerStats: () => api.get('/orders/farmer/stats'),
};

// Farmers
export const farmersAPI = {
  getProfile: (userId) => api.get(`/farmers/${userId}`),
  getMyProfile: () => api.get('/farmers/me/profile'),
  createProfile: (data) =>
    api.post('/farmers/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProfile: (data) =>
    api.put('/farmers/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingFarmers: () => api.get('/admin/farmers/pending'),
  approveFarmer: (id) => api.put(`/admin/farmers/approve/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
  getOrders: (params) => api.get('/admin/orders', { params }),
};

export default api;
