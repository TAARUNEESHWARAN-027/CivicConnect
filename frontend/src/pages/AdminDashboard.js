// ==============================
// Admin Dashboard Page
// ==============================
// Allows admins to view all issues, filter by status,
// update issue statuses, and add remarks.

import React, { useState, useEffect } from 'react';
import { getAllIssues, updateIssueStatus } from '../services/api';
import './AdminDashboard.css';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    message: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const data = await getAllIssues();
      setIssues(data.issues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter issues by status
  const filteredIssues =
    filter === 'All'
      ? issues
      : issues.filter((issue) => issue.status === filter);

  // Count issues by status
  const statusCounts = {
    All: issues.length,
    Pending: issues.filter((i) => i.status === 'Pending').length,
    'In Progress': issues.filter((i) => i.status === 'In Progress').length,
    Resolved: issues.filter((i) => i.status === 'Resolved').length,
  };

  // Open the update modal for a specific issue
  const openUpdateModal = (issue) => {
    setSelectedIssue(issue);
    setUpdateForm({ status: issue.status, message: '' });
  };

  // Close the update modal
  const closeUpdateModal = () => {
    setSelectedIssue(null);
    setUpdateForm({ status: '', message: '' });
  };

  // Handle status update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await updateIssueStatus(
        selectedIssue.id,
        updateForm.status,
        updateForm.message
      );
      closeUpdateModal();
      fetchIssues(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-text">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all reported civic issues.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Status filter cards */}
      <div className="admin-stats">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`stat-card card ${
              filter === status ? 'stat-active' : ''
            }`}
            onClick={() => setFilter(status)}
          >
            <div className="stat-number">{count}</div>
            <div className="stat-label">{status}</div>
          </div>
        ))}
      </div>

      {/* Issues table */}
      <div className="admin-table-wrapper card">
        <h2 className="admin-table-title">
          {filter === 'All' ? 'All Issues' : `${filter} Issues`}
        </h2>

        {filteredIssues.length === 0 ? (
          <p className="admin-empty">No issues found.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>#{issue.id}</td>
                    <td className="td-title">{issue.title}</td>
                    <td>{issue.category}</td>
                    <td>{issue.location}</td>
                    <td>{issue.reporter_name}</td>
                    <td>
                      <span
                        className={`status-badge status-${issue.status
                          .toLowerCase()
                          .replace(' ', '')}`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {new Date(issue.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openUpdateModal(issue)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Issue #{selectedIssue.id}</h3>
              <button className="modal-close" onClick={closeUpdateModal}>
                &times;
              </button>
            </div>
            <p className="modal-subtitle">{selectedIssue.title}</p>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label htmlFor="update-status">Status</label>
                <select
                  id="update-status"
                  className="form-select"
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, status: e.target.value })
                  }
                  required
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="update-message">Admin Remarks (optional)</label>
                <textarea
                  id="update-message"
                  className="form-textarea"
                  placeholder="Add a note about this update..."
                  value={updateForm.message}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, message: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeUpdateModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
