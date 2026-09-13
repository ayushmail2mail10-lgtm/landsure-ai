import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('landsure_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't forcefully redirect if on login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('landsure_token');
        localStorage.removeItem('landsure_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
