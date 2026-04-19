import axios from 'axios';

// Base URL of your backend
const API = axios.create({
  baseURL: 'https://vedicsevas-backend.onrender.com/api'
});

// Before every request, automatically add the token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vs_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If any request gets a 401 (unauthorized), log out
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vs_admin_token');
      localStorage.removeItem('vs_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;