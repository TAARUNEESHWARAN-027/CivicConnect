// ==============================
// Issues Routes
// ==============================
// Defines API endpoints for issue management.

const express = require('express');
const router = express.Router();
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  getStats,
} = require('../controllers/issueController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// All issue routes require authentication
router.use(authenticate);

// GET /api/issues - Get all issues (filtered by role)
router.get('/', getAllIssues);

// GET /api/issues/stats - Get admin statistics (admin only)
router.get('/stats', authorizeAdmin, getStats);

// GET /api/issues/:id - Get a specific issue with updates
router.get('/:id', getIssueById);

// POST /api/issues - Create a new issue
router.post('/', createIssue);

// PUT /api/issues/:id/status - Update issue status (admin only)
router.put('/:id/status', authorizeAdmin, updateIssueStatus);

module.exports = router;
