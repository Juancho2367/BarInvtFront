import axios from 'axios';
import { Product, Sale, Client, Event } from '../../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id'>) => api.post<Product>('/products', product),
  update: (id: string, product: Partial<Product>) => api.patch<Product>(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Sales API
export const salesApi = {
  getAll: () => api.get<Sale[]>('/sales'),
  getById: (id: string) => api.get<Sale>(`/sales/${id}`),
  create: (sale: Omit<Sale, 'id'>) => api.post<Sale>('/sales', sale),
  update: (id: string, sale: Partial<Sale>) => api.patch<Sale>(`/sales/${id}`, sale),
  delete: (id: string) => api.delete(`/sales/${id}`),
};

// Clients API
export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (client: Omit<Client, 'id'>) => api.post<Client>('/clients', client),
  update: (id: string, client: Partial<Client>) => api.patch<Client>(`/clients/${id}`, client),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

// Events API
export const eventsApi = {
  getAll: () => api.get<Event[]>('/events'),
  getById: (id: string) => api.get<Event>(`/events/${id}`),
  create: (event: Omit<Event, 'id'>) => api.post<Event>('/events', event),
  update: (id: string, event: Partial<Event>) => api.patch<Event>(`/events/${id}`, event),
  delete: (id: string) => api.delete(`/events/${id}`),
};

export default api; 