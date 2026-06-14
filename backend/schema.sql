-- ==============================
-- CivicConnect Database Schema
-- ==============================
-- Run this script to create the database and tables.
-- Usage: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS civicconnect;
USE civicconnect;

-- ==============================
-- Users Table
-- Stores registered user accounts
-- ==============================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- bcrypt hashed password
  role ENUM('User', 'Admin') DEFAULT 'User',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- Issues Table
-- Stores reported civic issues
-- ==============================
CREATE TABLE IF NOT EXISTS issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Pothole', 'Streetlight', 'Garbage', 'Water Leakage', 'Other') NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('Pending', 'In Progress', 'Resolved') DEFAULT 'Pending',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Updates Table
-- Stores status updates and admin remarks for issues
-- ==============================
CREATE TABLE IF NOT EXISTS updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT NOT NULL,
  message TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

-- ==============================
-- Sample Data
-- ==============================

-- Insert sample users (passwords are bcrypt hashed versions of "password123")
-- Generated with: require('bcryptjs').hashSync('password123', 10)
-- WARNING: These are for development only. Use real hashed passwords in production.
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', '$2a$10$/ru2cKfLZxZLpL9fZPIpWeN39sDNbsLGAlEHTIHByCRgxYT9MiY6m', 'User'),
('Jane Smith', 'jane@example.com', '$2a$10$/ru2cKfLZxZLpL9fZPIpWeN39sDNbsLGAlEHTIHByCRgxYT9MiY6m', 'User'),
('Admin User', 'admin@civicconnect.com', '$2a$10$/ru2cKfLZxZLpL9fZPIpWeN39sDNbsLGAlEHTIHByCRgxYT9MiY6m', 'Admin');

-- Insert sample issues
INSERT INTO issues (title, description, category, location, status, user_id) VALUES
('Large pothole on Main Street', 'There is a large pothole near the intersection that damages cars.', 'Pothole', 'Main Street & 5th Ave', 'Pending', 1),
('Streetlight not working on Oak Avenue', 'The streetlight near house #42 has been out for a week.', 'Streetlight', '42 Oak Avenue', 'In Progress', 1),
('Garbage not collected on Maple Drive', 'Garbage has not been collected for two weeks on our street.', 'Garbage', 'Maple Drive', 'Resolved', 2),
('Water leaking from fire hydrant', 'Fire hydrant at the corner is leaking water constantly.', 'Water Leakage', 'Pine Street & Elm Road', 'Pending', 2);

-- Insert sample updates
INSERT INTO updates (issue_id, message) VALUES
(2, 'Filed a work order to the electrical department.'),
(2, 'Electrician dispatched to fix the streetlight.'),
(3, 'Garbage collection route adjusted. Issue resolved.');
