import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
  baseURL = import.meta.env.VITE_API_URL.endsWith('/') 
    ? `${import.meta.env.VITE_API_URL}api` 
    : `${import.meta.env.VITE_API_URL}/api`;
}

export const api = axios.create({
  baseURL,
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
