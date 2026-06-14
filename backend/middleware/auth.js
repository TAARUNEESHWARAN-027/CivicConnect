// ==============================
// JWT Authentication Middleware
// ==============================
// Verifies the JWT token from the Authorization header
// and attaches user info to the request object.

const jwt = require('jsonwebtoken');

/**
 * Middleware: Protect routes with JWT authentication
 * Checks for a valid token in the Authorization header.
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from the Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object for use in route handlers
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Middleware: Restrict access to Admin users only
 * Must be used AFTER the authenticate middleware.
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { authenticate, authorizeAdmin };
