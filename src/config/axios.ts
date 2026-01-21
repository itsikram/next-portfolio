import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create axios instance with default configuration for browser environment
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://44.221.59.187:5000/api'  // Use full URL with port 5000
    : 'http://localhost:5000/api', // Use backend URL directly in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure browser-only adapter is used
  adapter: 'xhr' as const,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access only on client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
