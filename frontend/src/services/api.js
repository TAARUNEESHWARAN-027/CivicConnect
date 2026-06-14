// ==============================
// API Service
// ==============================
// Centralized service for making HTTP requests to the backend.
// Handles token attachment and error formatting.

// Use environment variable if available, otherwise default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Helper: Get the stored JWT token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Helper: Create headers with optional auth token
 */
const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

/**
 * Helper: Handle API response and errors
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }
  return data;
};

// ==============================
// Authentication API Calls
// ==============================

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

// ==============================
// Issues API Calls
// ==============================

export const getAllIssues = async () => {
  const response = await fetch(`${API_URL}/issues`, {
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

export const getIssueById = async (id) => {
  const response = await fetch(`${API_URL}/issues/${id}`, {
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

export const createIssue = async (issueData) => {
  const response = await fetch(`${API_URL}/issues`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(issueData),
  });
  return handleResponse(response);
};

export const updateIssueStatus = async (id, status, message) => {
  const response = await fetch(`${API_URL}/issues/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ status, message }),
  });
  return handleResponse(response);
};

export const getIssueStats = async () => {
  const response = await fetch(`${API_URL}/issues/stats`, {
    headers: getHeaders(true),
  });
  return handleResponse(response);
};
