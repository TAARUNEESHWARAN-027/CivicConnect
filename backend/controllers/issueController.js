// ==============================
// Issues Controller
// ==============================
// Handles all issue-related operations:
// creating, reading, updating, and managing issues.

const db = require('../config/db');

/**
 * GET /api/issues
 * Get all issues (Admin: all issues, User: only their own issues)
 */
const getAllIssues = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === 'Admin') {
      // Admins can see all issues with the reporter's name
      query = `
        SELECT issues.*, users.name AS reporter_name
        FROM issues
        JOIN users ON issues.user_id = users.id
        ORDER BY issues.created_at DESC
      `;
    } else {
      // Regular users only see their own issues
      query = `
        SELECT * FROM issues
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;
      params = [req.user.id];
    }

    const [issues] = await db.query(query, params);
    res.json({ issues });
  } catch (error) {
    console.error('Get Issues Error:', error.message);
    res.status(500).json({ error: 'Server error fetching issues.' });
  }
};

/**
 * GET /api/issues/:id
 * Get a single issue by ID with its updates
 */
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the issue with the reporter's name
    const [issues] = await db.query(
      `SELECT issues.*, users.name AS reporter_name
       FROM issues
       JOIN users ON issues.user_id = users.id
       WHERE issues.id = ?`,
      [id]
    );

    if (issues.length === 0) {
      return res.status(404).json({ error: 'Issue not found.' });
    }

    const issue = issues[0];

    // Check if the user is authorized to view this issue
    if (req.user.role !== 'Admin' && issue.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Get all updates for this issue
    const [updates] = await db.query(
      'SELECT * FROM updates WHERE issue_id = ? ORDER BY updated_at ASC',
      [id]
    );

    res.json({ issue, updates });
  } catch (error) {
    console.error('Get Issue Error:', error.message);
    res.status(500).json({ error: 'Server error fetching issue.' });
  }
};

/**
 * POST /api/issues
 * Create a new issue report
 * Request body: { title, description, category, location }
 */
const createIssue = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate category
    const validCategories = ['Pothole', 'Streetlight', 'Garbage', 'Water Leakage', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    // Insert the new issue
    const [result] = await db.query(
      'INSERT INTO issues (title, description, category, location, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, location, req.user.id]
    );

    res.status(201).json({
      message: 'Issue reported successfully.',
      issue: {
        id: result.insertId,
        title,
        description,
        category,
        location,
        status: 'Pending',
        user_id: req.user.id,
      },
    });
  } catch (error) {
    console.error('Create Issue Error:', error.message);
    res.status(500).json({ error: 'Server error creating issue.' });
  }
};

/**
 * PUT /api/issues/:id/status
 * Admin only: Update the status of an issue
 * Request body: { status, message }
 */
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    // Check if the issue exists
    const [issues] = await db.query('SELECT * FROM issues WHERE id = ?', [id]);
    if (issues.length === 0) {
      return res.status(404).json({ error: 'Issue not found.' });
    }

    // Update the issue status
    await db.query('UPDATE issues SET status = ? WHERE id = ?', [status, id]);

    // If an admin message is provided, add it as an update
    if (message && message.trim()) {
      await db.query(
        'INSERT INTO updates (issue_id, message) VALUES (?, ?)',
        [id, message.trim()]
      );
    }

    res.json({ message: 'Issue status updated successfully.' });
  } catch (error) {
    console.error('Update Issue Status Error:', error.message);
    res.status(500).json({ error: 'Server error updating issue status.' });
  }
};

/**
 * GET /api/issues/stats
 * Admin only: Get summary statistics
 */
const getStats = async (req, res) => {
  try {
    const [totalIssues] = await db.query('SELECT COUNT(*) AS count FROM issues');
    const [statusCounts] = await db.query(
      'SELECT status, COUNT(*) AS count FROM issues GROUP BY status'
    );
    const [totalUsers] = await db.query('SELECT COUNT(*) AS count FROM users');

    res.json({
      totalIssues: totalIssues[0].count,
      totalUsers: totalUsers[0].count,
      statusCounts,
    });
  } catch (error) {
    console.error('Get Stats Error:', error.message);
    res.status(500).json({ error: 'Server error fetching statistics.' });
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  getStats,
};
