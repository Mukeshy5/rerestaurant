import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getFeatured: () => API.get('/products/featured'),
  getTrending: () => API.get('/products/trending'),
  getFlashSale: () => API.get('/products/flash-sale'),
  getById: (id) => API.get(`/products/${id}`),
  getBySlug: (slug) => API.get(`/products/${slug}`),
};

export const categoryAPI = {
  getAll: (params) => API.get('/categories', { params }),
  getAllCategories: () => API.get('/categories/all'),
};

export const storeAPI = {
  getAll: (params) => API.get('/stores', { params }),
  getFeatured: () => API.get('/stores/featured'),
  getBySlug: (slug) => API.get(`/stores/${slug}`),
};

export const cartAPI = {
  getCart: () => API.get('/cart'),
  addItem: (data) => API.post('/cart/add', data),
  updateItem: (productId, data) => API.put(`/cart/update/${productId}`, data),
  removeItem: (productId, variant) => API.delete(`/cart/remove/${productId}`, { params: { variant: JSON.stringify(variant) } }),
  clearCart: () => API.delete('/cart'),
};

export const orderAPI = {
  getAll: (params) => API.get('/orders', { params }),
  getById: (id) => API.get(`/orders/${id}`),
  create: (data) => API.post('/orders', data),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

export const bannerAPI = {
  getAll: () => API.get('/banners'),
};

export const couponAPI = {
  getAll: () => API.get('/coupons'),
  validate: (data) => API.post('/coupons/validate', data),
};

export const reviewAPI = {
  getByProduct: (productId, params) => API.get(`/reviews/product/${productId}`, { params }),
  create: (data) => API.post('/reviews', data),
};

export default API;