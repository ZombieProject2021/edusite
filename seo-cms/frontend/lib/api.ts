import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
};

// Posts
export const postsApi = {
  getAll: (params?: any) => api.get('/api/posts', { params }),
  getById: (id: string) => api.get(`/api/posts/${id}`),
  getBySlug: (slug: string) => api.get(`/api/posts/slug/${slug}`),
  create: (data: any) => api.post('/api/posts', data),
  update: (id: string, data: any) => api.put(`/api/posts/${id}`, data),
  delete: (id: string) => api.delete(`/api/posts/${id}`),
  analyzeSeo: (id: string) => api.get(`/api/posts/${id}/analyze-seo`),
};

// Media
export const mediaApi = {
  upload: (file: File, alt?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);
    return api.post('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: (params?: any) => api.get('/api/media', { params }),
  getById: (id: string) => api.get(`/api/media/${id}`),
  update: (id: string, data: any) => api.put(`/api/media/${id}`, data),
  delete: (id: string) => api.delete(`/api/media/${id}`),
};

// SEO
export const seoApi = {
  getSettings: () => api.get('/api/seo/settings'),
  updateSettings: (data: any) => api.put('/api/seo/settings', data),
  analyzePost: (postId: string) => api.get(`/api/seo/analyze/${postId}`),
};

export default api;
