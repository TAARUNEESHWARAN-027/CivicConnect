// ==============================
// Report Issue Page
// ==============================
// Form for citizens to report a new civic issue.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIssue } from '../services/api';
import './ReportIssue.css';

const CATEGORIES = ['Pothole', 'Streetlight', 'Garbage', 'Water Leakage', 'Other'];

const ReportIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      await createIssue(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="page-header">
        <h1>Report an Issue</h1>
        <p>Help improve your community by reporting local problems.</p>
      </div>

      <div className="report-card card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Issue Title */}
          <div className="form-group">
            <label htmlFor="title">Issue Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="e.g., Large pothole on Main Street"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              placeholder="e.g., Main Street & 5th Ave"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="report-actions">
            <Link to="/dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
