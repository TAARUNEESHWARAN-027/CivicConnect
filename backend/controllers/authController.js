// ==============================
// Authentication Controller
// ==============================
// Handles user registration and login logic.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * POST /api/auth/register
 * Creates a new user account.
 * Request body: { name, email, password }
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if email is already registered
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'User']
    );

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: result.insertId, name, email, role: 'User' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: result.insertId, name, email, role: 'User' },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 * Request body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile.
 * Used to verify token validity on page refresh.
 */
const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
};

module.exports = { register, login, getMe };
