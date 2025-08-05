import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Debug: Log the API URL being used
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '') + '/api';
console.log('🔗 API URL:', apiUrl);
console.log('🔗 Environment variable VITE_API_URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      console.error('🔍 404 Error - Endpoint not found. Check if the backend is deployed correctly.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout. Check if the backend is responding.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 