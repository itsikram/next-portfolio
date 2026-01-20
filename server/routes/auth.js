const express = require('express');
const { generateToken, comparePassword } = require('../middleware/auth');
const router = express.Router();

// Simple in-memory admin user (in production, use database)
const adminUser = {
  email: process.env.ADMIN_EMAIL || 'ikram@admin.com',
  password: process.env.ADMIN_PASSWORD || 'admin@333'
};

// Login route
router.post('/login', async (req, res) => {
  console.log("env",process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email !== adminUser.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = password === adminUser.password;
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: 1, email: adminUser.email });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: 1,
        email: adminUser.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token route
router.get('/verify', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;
