import axios from 'axios';
import toast from 'react-hot-toast';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (typeof window !== 'undefined') {
    const { origin } = window.location;
    // When the frontend is deployed with the backend, hit the same origin
    if (!origin.includes('localhost')) {
      return `${origin}/api`;
    }
  }

  // Local fallback for development (backend runs on 5001)
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;

