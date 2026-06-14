// ==============================
// CivicConnect - Backend Server
// ==============================
// Entry point for the Express API server.
// Connects middleware, routes, and starts listening.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');

const app = express();
const PORT = process.env.PORT || 5000;

// ==============================
// Middleware
// ==============================

// Enable CORS so the frontend (on a different port) can talk to the backend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ==============================
// Routes
// ==============================

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'CivicConnect API is running!' });
});

// Auth routes (register, login)
app.use('/api/auth', authRoutes);

// Issue routes (CRUD operations for issues)
app.use('/api/issues', issueRoutes);

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
  console.log(`CivicConnect server running on http://localhost:${PORT}`);
});
