import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create axios instance for server-side requests
const serverApi = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.API_URL || 'http://localhost:5000'
    : 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default serverApi;
