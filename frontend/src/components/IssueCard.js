// ==============================
// IssueCard Component
// ==============================
// Displays a summary of an issue in a card format.

import React from 'react';
import { Link } from 'react-router-dom';
import './IssueCard.css';

const IssueCard = ({ issue }) => {
  return (
    <Link to={`/issues/${issue.id}`} className="issue-card card">
      <div className="issue-card-header">
        <h3 className="issue-title">{issue.title}</h3>
        <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '')}`}>
          {issue.status}
        </span>
      </div>
      <div className="issue-card-body">
        <p className="issue-description">
          {issue.description.length > 120
            ? issue.description.substring(0, 120) + '...'
            : issue.description}
        </p>
      </div>
      <div className="issue-card-footer">
        <span className="issue-meta">{issue.category}</span>
        <span className="issue-meta">{issue.location}</span>
        <span className="issue-meta">
          {new Date(issue.created_at).toLocaleDateString()}
        </span>
      </div>
      {issue.reporter_name && (
        <div className="issue-card-reporter">
          Reported by: {issue.reporter_name}
        </div>
      )}
    </Link>
  );
};

export default IssueCard;
