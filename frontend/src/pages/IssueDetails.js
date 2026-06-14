// ==============================
// Issue Details Page
// ==============================
// Shows the full details of a single issue and its update history.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIssueById } from '../services/api';
import './IssueDetails.css';

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await getIssueById(id);
        setIssue(data.issue);
        setUpdates(data.updates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) {
    return <div className="loading-text">Loading issue details...</div>;
  }

  if (error) {
    return (
      <div className="issue-error">
        <div className="alert alert-error">{error}</div>
        <Link to="/dashboard" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!issue) {
    return <div className="loading-text">Issue not found.</div>;
  }

  return (
    <div className="issue-detail">
      <Link to="/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>

      <div className="issue-detail-card card">
        <div className="issue-detail-header">
          <h1>{issue.title}</h1>
          <span
            className={`status-badge status-${issue.status
              .toLowerCase()
              .replace(' ', '')}`}
          >
            {issue.status}
          </span>
        </div>

        <div className="issue-detail-meta">
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <span className="meta-value">{issue.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Location</span>
            <span className="meta-value">{issue.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Reported By</span>
            <span className="meta-value">{issue.reporter_name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Date Reported</span>
            <span className="meta-value">
              {new Date(issue.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="issue-detail-description">
          <h3>Description</h3>
          <p>{issue.description}</p>
        </div>
      </div>

      {/* Updates timeline */}
      <div className="updates-section">
        <h2>Updates</h2>
        {updates.length === 0 ? (
          <div className="card updates-empty">
            <p>No updates yet. Check back later.</p>
          </div>
        ) : (
          <div className="updates-timeline">
            {updates.map((update, index) => (
              <div key={update.id} className="update-item card">
                <div className="update-number">#{index + 1}</div>
                <div className="update-content">
                  <p>{update.message}</p>
                  <span className="update-date">
                    {new Date(update.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDetails;
