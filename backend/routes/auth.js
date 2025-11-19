const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { findUserByUsername } = require('../models/user');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = 'baseline-healthcare-secret-key-2024';
const JWT_EXPIRATION = '24h';

// Simple login - WITH JWT TOKEN
router.post('/login', (req, res) => {
  const startTime = Date.now(); // Start timing
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password required',
      responseTime: Date.now() - startTime 
    });
  }

  const user = findUserByUsername(username);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      responseTime: Date.now() - startTime 
    });
  }

  // Plain text password comparison - NO SECURITY (baseline)
  if (user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      responseTime: Date.now() - startTime 
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  const responseTime = Date.now() - startTime;

  // Return user info and token
  res.json({
    message: 'Login successful',
    token: token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    },
    responseTime: responseTime,
    timestamp: new Date().toISOString()
  });
});

// Token verification endpoint (optional - for testing)
router.post('/verify', (req, res) => {
  const startTime = Date.now();
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided',
      responseTime: Date.now() - startTime 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      user: decoded,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid token',
      responseTime: Date.now() - startTime
    });
  }
});

// Simple logout
router.post('/logout', (req, res) => {
  const startTime = Date.now();
  res.json({ 
    message: 'Logout successful',
    responseTime: Date.now() - startTime,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;