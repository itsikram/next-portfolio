import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create axios instance with default configuration for browser environment
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://44.221.59.187:5000/api/'  // Use full URL with port 5000
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
    // Log server URL and request details
    console.log(`🌐 Server URL: ${config.baseURL}`);
    console.log(`📤 ${config.method?.toUpperCase()} Request: ${config.url}`);
    console.log('📋 Request Headers:', config.headers);
    if (config.data) {
      console.log('📦 Request Data:', config.data);
    }
    
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
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response details
    console.log(`✅ ${response.config.method?.toUpperCase()} Response: ${response.config.url}`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log('📋 Response Headers:', response.headers);
    if (response.data) {
      console.log('📦 Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    // Log error response details
    console.log(`❌ ${error.config?.method?.toUpperCase()} Error: ${error.config?.url}`);
    console.log(`📊 Status: ${error.response?.status} ${error.response?.statusText}`);
    console.log('📋 Error Headers:', error.response?.headers);
    if (error.response?.data) {
      console.log('📦 Error Data:', error.response?.data);
    }
    
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
