import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['programmerikram.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    const API_URL = process.env.NODE_ENV === 'production' 
      ? 'http://localhost:5000' 
      : 'http://localhost:5000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
