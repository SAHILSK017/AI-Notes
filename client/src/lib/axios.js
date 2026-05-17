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

export default api;
