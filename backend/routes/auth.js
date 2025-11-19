const express = require('express');
const router = express.Router();
const { findUserByUsername } = require('../models/user');

// Simple login - NO PASSWORD HASHING, NO TOKENS
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = findUserByUsername(username);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Plain text password comparison - NO SECURITY
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Return user info directly - NO TOKEN
  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      department: user.department
    }
  });
});

// Simple logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;