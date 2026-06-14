# 🏛️ CivicConnect

> A full-stack civic issue reporting platform where citizens can report local problems and authorities can track and resolve them.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-grey?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-red)

---

## 📋 About

CivicConnect is a web-based platform that bridges the gap between citizens and local authorities. Citizens can report issues like potholes, streetlight outages, or garbage buildup — and track their resolution in real time. Admins can view all reports, update statuses, and add remarks.

**Built as a portfolio/interview project** demonstrating full-stack development with JWT authentication, role-based access, and CRUD operations.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure register/login with encrypted passwords |
| 👤 **User Dashboard** | View your reported issues with status filters |
| 📝 **Report Issue** | Submit issues with title, description, category & location |
| 📄 **Issue Details** | Full issue view with update history / audit trail |
| 🛡️ **Admin Dashboard** | View all issues, update statuses, add remarks |
| 🔒 **Role-Based Access** | User and Admin roles with route protection |

---

## 🖼️ Screenshots

> _Add screenshots here after deploying!_

```
<!-- Example:
![Login Page](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Admin Panel](screenshots/admin.png)
-->
```

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│    MySQL    │
│  React.js   │◀────│ Express.js  │◀────│  Database   │
│  Port 3000  │     │  Port 5000  │     │  Port 3306  │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **Frontend** — React 18 with React Router, plain CSS, Context API for state
- **Backend** — Express.js REST API with JWT auth middleware
- **Database** — MySQL 8 with relational schema (users, issues, updates)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MySQL](https://www.mysql.com/) v8 (or use Docker)
- [Docker](https://www.docker.com/) (optional — for easy MySQL setup)

### Quick Start (with Docker for MySQL)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/civicconnect.git
cd civicconnect

# Start MySQL via Docker
docker run -d --name civicconnect-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=civicconnect \
  -p 3306:3306 mysql:8

# Wait 20 seconds, then load the schema
docker exec -i civicconnect-mysql mysql -uroot -proot123 civicconnect < backend/schema.sql

# Configure the backend
cd backend
# Edit .env and set DB_PASSWORD=root123

# Install & start backend
npm install
npm start
# API runs at http://localhost:5000

# In a new terminal — install & start frontend
cd ../frontend
npm install
npm start
# App opens at http://localhost:3000
```

### Manual Setup (without Docker)

1. Install MySQL and create the database
2. Run `mysql -u root -p < backend/schema.sql`
3. Edit `backend/.env` with your MySQL credentials
4. `cd backend && npm install && npm start`
5. `cd frontend && npm install && npm start`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | — | Create account |
| `POST` | `/api/auth/login` | ❌ | — | Login |
| `GET` | `/api/auth/me` | ✅ | Any | Get profile |
| `GET` | `/api/issues` | ✅ | Any | List issues |
| `GET` | `/api/issues/:id` | ✅ | Any | Issue detail |
| `POST` | `/api/issues` | ✅ | Any | Report issue |
| `PUT` | `/api/issues/:id/status` | ✅ | Admin | Update status |
| `GET` | `/api/issues/stats` | ✅ | Admin | Dashboard stats |

---

## 🗄️ Database Schema

Three core tables:

- **`users`** — id, name, email, password (hashed), role, timestamps
- **`issues`** — id, title, description, category, location, status, user_id (FK), timestamps
- **`updates`** — id, issue_id (FK), status, remark, updated_by (FK), timestamps

See `backend/schema.sql` for the full schema and sample data.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API |
| Styling | Plain CSS (no frameworks) |
| Backend | Node.js, Express.js |
| Database | MySQL 8, mysql2 driver |
| Auth | JWT (bcrypt for passwords) |
| DevOps | Docker (for MySQL), Nodemon (dev) |

---

## 📁 Project Structure

```
CivicConnect/
├── backend/          # Express.js REST API
│   ├── config/       # Database connection
│   ├── controllers/  # Business logic
│   ├── middleware/    # JWT auth & role checks
│   ├── routes/       # API route definitions
│   └── schema.sql    # Database schema + seed data
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth state management
│   │   ├── pages/        # Route-level pages
│   │   └── services/     # API client
│   └── public/
└── README.md
```

---

> Demo accounts are included in the schema seed data for testing purposes.

---

## 🔮 Future Improvements

- [ ] Image uploads for issue photos
- [ ] Email/push notifications on status changes
- [ ] Pagination for large issue lists
- [ ] Map view with location markers
- [ ] Unit & integration tests
- [ ] Comments/discussion on issues
- [ ] Deployment (Vercel + Render + PlanetScale)

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">Built with ❤️ as a full-stack portfolio project</p>
