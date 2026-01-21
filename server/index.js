const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const homeContentRoutes = require('./routes/homeContent');
const aboutContentRoutes = require('./routes/aboutContent');
const resumeContentRoutes = require('./routes/resumeContent');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contact');
const quoteRoutes = require('./routes/quote');
const generalDetailsRoutes = require('./routes/generalDetails');
const processContentRoutes = require('./routes/processContent');
const importExportRoutes = require('./routes/importExport');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://44.221.59.187:3000', 'http://44.221.59.187:5000', 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Manual preflight handler
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json());

// Set up file upload middleware
const { upload } = require('./config/cloudinary');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/home-content', homeContentRoutes);
app.use('/api/about-content', aboutContentRoutes);
app.use('/api/resume-content', resumeContentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/general-details', generalDetailsRoutes);
app.use('/api/process-content', processContentRoutes);
app.use('/api/services', require('./routes/services'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/import-export', importExportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  const serverAddress = `http://localhost:${PORT}`;
  
  // Get actual IP addresses
  const networkInterfaces = os.networkInterfaces();
  const ipAddresses = [];
  
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(iface => {
      // Skip internal and non-IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        ipAddresses.push(iface.address);
      }
    });
  });
  
  console.log('🚀 Server started successfully!');
  console.log(`🌐 Local server address: ${serverAddress}`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 API endpoints available at: ${serverAddress}/api/`);
  console.log(`🌍 Server is accessible on all network interfaces (0.0.0.0:${PORT})`);
  
  if (ipAddresses.length > 0) {
    console.log(`📍 Actual server IP addresses:`);
    ipAddresses.forEach(ip => {
      console.log(`   - http://${ip}:${PORT}`);
    });
  } else {
    console.log(`💡 No external IP addresses found. Check network configuration.`);
  }
});
