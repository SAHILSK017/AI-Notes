import axios from 'axios';

let baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-notes-h9au.onrender.com/api';

// Force append /api if the Vercel environment variable is missing it
if (baseURL && !baseURL.endsWith('/api')) {
  baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Automatically attach Bearer token to requests if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
