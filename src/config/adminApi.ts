import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create axios instance for admin routes with browser compatibility
const adminApi = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Use relative path in production to avoid CORS issues
    : 'http://localhost:5000/api', // Use backend URL directly in development
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure browser-only adapter is used
  adapter: 'xhr' as const,
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor to add admin token
adminApi.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
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

// Response interceptor for admin-specific error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle admin-specific errors
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. Insufficient permissions.'));
    }
    
    return Promise.reject(error);
  }
);

export default adminApi;
