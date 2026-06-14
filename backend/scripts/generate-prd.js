// ==============================
// CivicConnect - PRD Document Generator
// ==============================
// Generates a comprehensive Word document (.docx) covering:
// - Complete project overview
// - File-by-file breakdown
// - Architecture & connections
// - Database schema
// - API endpoints
// - Workflows
// - Setup guide
// - Interview Q&A
//
// Run: node scripts/generate-prd.js
// ==============================

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, PageBreak, BorderStyle,
  WidthType, ShadingType, LevelFormat,
  convertInchesToTwip,
} = require('docx');

// ==============================
// Color Constants
// ==============================
const COLORS = {
  primary: '2C5282',    // Dark blue
  secondary: '4A90D9',  // Blue
  accent: '357ABD',      // Medium blue
  dark: '2C3E50',        // Dark text
  medium: '7F8C8D',     // Medium gray
  light: 'F5F7FA',       // Light bg
  white: 'FFFFFF',
  code: 'E8F0FE',       // Code background
};

// ==============================
// Helper Functions
// ==============================

const heading = (text, level = 1) => {
  const headingMap = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
  };
  return new Paragraph({
    text,
    heading: headingMap[level] || HeadingLevel.HEADING_2,
    spacing: { before: level === 1 ? 400 : 300, after: 200 },
  });
};

const subheading = (text) => heading(text, 3);

const para = (text, options = {}) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        font: 'Calibri',
        color: COLORS.dark,
        ...options,
      }),
    ],
    spacing: { after: 120, before: options.before || 0 },
    alignment: options.alignment,
  });
};

const boldPara = (text, options = {}) => {
  return para(text, { bold: true, ...options });
};

const bullet = (text, level = 0) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        font: 'Calibri',
        color: COLORS.dark,
      }),
    ],
    spacing: { after: 60 },
    numbering: {
      reference: 'bullet-list',
      level,
    },
  });
};

const numberedItem = (text, level = 0) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22,
        font: 'Calibri',
        color: COLORS.dark,
      }),
    ],
    spacing: { after: 60 },
    numbering: {
      reference: 'numbered-list',
      level,
    },
  });
};

const codeBlock = (code) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: code,
        size: 20,
        font: 'Consolas',
        color: '1A1A2E',
      }),
    ],
    spacing: { before: 80, after: 80 },
    shading: { type: ShadingType.CLEAR, fill: COLORS.code },
    indent: { left: convertInchesToTwip(0.3) },
  });
};

const codeLine = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 20,
        font: 'Consolas',
        color: '1A1A2E',
      }),
    ],
    spacing: { before: 20, after: 20 },
    shading: { type: ShadingType.CLEAR, fill: COLORS.code },
    indent: { left: convertInchesToTwip(0.3) },
  });
};

const emptyLine = () => new Paragraph({ spacing: { after: 60 } });

const separator = () => new Paragraph({
  spacing: { before: 200, after: 200 },
  border: {
    bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.secondary },
  },
});



// Table helper
const createTable = (headers, rows) => {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h) => 
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: h,
                bold: true,
                size: 20,
                font: 'Calibri',
                color: COLORS.white,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        shading: { type: ShadingType.CLEAR, fill: COLORS.primary },
        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
      })
    ),
  });

  const dataRows = rows.map((row) => 
    new TableRow({
      children: row.map((cell, idx) => 
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cell,
                  size: 20,
                  font: 'Calibri',
                  color: COLORS.dark,
                }),
              ],
            }),
          ],
          shading: idx === 0 ? { type: ShadingType.CLEAR, fill: COLORS.light } : undefined,
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
        })
      ),
    })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

// ==============================
// Document Content
// ==============================

const generateDocument = () => {
  const sections = [];

  // =========================================================
  // COVER PAGE
  // =========================================================
  sections.push(
    // Spacer
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'CivicConnect',
          size: 56,
          font: 'Calibri',
          bold: true,
          color: COLORS.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Community Issue Reporting Platform',
          size: 32,
          font: 'Calibri',
          color: COLORS.secondary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Complete Product Requirements Document',
          size: 26,
          font: 'Calibri',
          color: COLORS.medium,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Full-Stack Interview Preparation Guide',
          size: 24,
          font: 'Calibri',
          color: COLORS.medium,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    separator(),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Tech Stack: ',
          size: 22,
          font: 'Calibri',
          bold: true,
          color: COLORS.dark,
        }),
        new TextRun({
          text: 'React.js | Node.js + Express.js | MySQL | JWT Authentication | Plain CSS',
          size: 22,
          font: 'Calibri',
          color: COLORS.medium,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Built for beginners to learn full-stack development',
          size: 22,
          font: 'Calibri',
          italic: true,
          color: COLORS.medium,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new PageBreak()
  );

  // =========================================================
  // TABLE OF CONTENTS
  // =========================================================
  sections.push(
    heading('Table of Contents', 1),
    bullet('1. Project Overview & Objectives'),
    bullet('2. Complete File Structure'),
    bullet('3. File-by-File Deep Dive'),
    bullet('4. Architecture & Component Connections'),
    bullet('5. Database Schema & Relationships'),
    bullet('6. API Endpoints Reference'),
    bullet('7. User Workflows (Step-by-Step)'),
    bullet('8. Authentication Flow (JWT Deep Dive)'),
    bullet('9. Complete Setup & Installation Guide'),
    bullet('10. Interview Preparation Q&A'),
    bullet('11. Extending the Project'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 1: PROJECT OVERVIEW
  // =========================================================
  sections.push(
    heading('1. Project Overview & Objectives', 1),
    
    heading('1.1 What is CivicConnect?', 2),
    para('CivicConnect is a full-stack web application that enables citizens to report local civic issues (like potholes, broken streetlights, garbage problems, and water leakages) and track their resolution status. Administrators can manage these reports, update statuses, and add remarks.'),
    emptyLine(),
    
    heading('1.2 Purpose', 2),
    para('The project is designed as a beginner-friendly, educational full-stack application. It demonstrates the complete flow of data from a user interface through an API layer to a database and back, making it ideal for students learning web development for the first time.'),
    emptyLine(),
    
    heading('1.3 Core Objectives', 2),
    bullet('Provide a simple civic issue reporting platform for citizens'),
    bullet('Enable role-based access control (User vs Admin)'),
    bullet('Demonstrate JWT-based authentication in a real application'),
    bullet('Showcase REST API architecture with Express.js'),
    bullet('Display database relationships (foreign keys, joins) in a practical context'),
    bullet('Create a clean, professional UI with plain CSS'),
    emptyLine(),
    
    heading('1.4 Technology Stack', 2),
    createTable(
      ['Layer', 'Technology', 'Purpose'],
      [
        ['Frontend', 'React.js 18', 'UI component library for building the SPA'],
        ['Routing', 'React Router v6', 'Client-side routing between pages'],
        ['Styling', 'Plain CSS', 'No frameworks - pure CSS with custom properties'],
        ['Backend', 'Node.js + Express.js', 'REST API server handling business logic'],
        ['Database', 'MySQL (mysql2 driver)', 'Relational database for persistent storage'],
        ['Auth', 'JWT (jsonwebtoken)', 'Stateless authentication tokens'],
        ['Password Hashing', 'bcryptjs', 'Secure password hashing with salt rounds'],
      ]
    ),
    emptyLine(),

    heading('1.5 Key Features', 2),
    bullet('User Registration & Login with JWT tokens'),
    bullet('Role-based access: regular Users and Admins'),
    bullet('Report issues with title, description, category, and location'),
    bullet('User Dashboard with filterable issue cards'),
    bullet('Issue Details page with update timeline'),
    bullet('Admin Dashboard with table view, status filter, and update modal'),
    bullet('Admin can update issue status and add remarks'),
    bullet('Automatic session restoration on page refresh'),
    bullet('Landing page for unauthenticated visitors'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 2: FILE STRUCTURE
  // =========================================================
  sections.push(
    heading('2. Complete File Structure', 1),
    para('The project contains 40 files in total (including configuration files and CSS). Below is the complete directory tree:'),
    emptyLine(),
    
    codeLine('CivicConnect/'),
    codeLine('\u2514\u2500\u2500 README.md                          # Project documentation & setup guide'),
    codeLine(''),
    codeLine('\u2514\u2500\u2500 backend/                            # Express.js API server (12 files)'),
    codeLine('    \u2514\u2500\u2500 .env                              # Environment variables (DB, JWT secret)'),
    codeLine('    \u2514\u2500\u2500 package.json                      # Dependencies & scripts'),
    codeLine('    \u2514\u2500\u2500 server.js                         # Entry point - Express app setup'),
    codeLine('    \u2514\u2500\u2500 schema.sql                        # MySQL DDL + sample data'),
    codeLine('    \u2514\u2500\u2500 config/'),
    codeLine('    \u2502   \u2514\u2500\u2500 db.js                      # MySQL connection pool setup'),
    codeLine('    \u2514\u2500\u2500 middleware/'),
    codeLine('    \u2502   \u2514\u2500\u2500 auth.js                    # JWT verify & admin authorize'),
    codeLine('    \u2514\u2500\u2500 controllers/'),
    codeLine('    \u2502   \u2514\u2500\u2500 authController.js          # Register, login, get profile'),
    codeLine('    \u2502   \u2514\u2500\u2500 issueController.js         # Issue CRUD & admin operations'),
    codeLine('    \u2514\u2500\u2500 routes/'),
    codeLine('        \u2514\u2500\u2500 auth.js                        # /api/auth endpoint definitions'),
    codeLine('        \u2514\u2500\u2500 issues.js                      # /api/issues endpoint definitions'),
    codeLine(''),
    codeLine('\u2514\u2500\u2500 frontend/                           # React.js SPA (26 files)'),
    codeLine('    \u2514\u2500\u2500 package.json                      # Dependencies & scripts'),
    codeLine('    \u2514\u2500\u2500 public/'),
    codeLine('    \u2502   \u2514\u2500\u2500 index.html                 # HTML template'),
    codeLine('    \u2514\u2500\u2500 src/'),
    codeLine('        \u2514\u2500\u2500 index.js                       # React DOM entry point'),
    codeLine('        \u2514\u2500\u2500 index.css                      # Global styles & CSS variables'),
    codeLine('        \u2514\u2500\u2500 App.js                         # Root component with routing'),
    codeLine('        \u2514\u2500\u2500 App.css                        # App-level styles (loading, landing)'),
    codeLine('        \u2514\u2500\u2500 context/'),
    codeLine('        \u2502   \u2514\u2500\u2500 AuthContext.js         # Auth state (React Context API)'),
    codeLine('        \u2514\u2500\u2500 services/'),
    codeLine('        \u2502   \u2514\u2500\u2500 api.js                 # API client (fetch wrapper)'),
    codeLine('        \u2514\u2500\u2500 components/'),
    codeLine('        \u2502   \u2514\u2500\u2500 Navbar.js              # Navigation bar'),
    codeLine('        \u2502   \u2514\u2500\u2500 Navbar.css'),
    codeLine('        \u2502   \u2514\u2500\u2500 IssueCard.js           # Issue summary card'),
    codeLine('        \u2502   \u2514\u2500\u2500 IssueCard.css'),
    codeLine('        \u2502   \u2514\u2500\u2500 PrivateRoute.js        # Auth route guard'),
    codeLine('        \u2514\u2500\u2500 pages/'),
    codeLine('            \u2514\u2500\u2500 Login.js / Login.css       # Login form page'),
    codeLine('            \u2514\u2500\u2500 Register.js                # Registration form (reuses Login.css)'),
    codeLine('            \u2514\u2500\u2500 Dashboard.js / Dashboard.css   # User issue dashboard'),
    codeLine('            \u2514\u2500\u2500 ReportIssue.js / ReportIssue.css # Issue submission form'),
    codeLine('            \u2514\u2500\u2500 IssueDetails.js / IssueDetails.css # Full issue view'),
    codeLine('            \u2514\u2500\u2500 AdminDashboard.js / AdminDashboard.css # Admin panel'),
    emptyLine(),
    boldPara('Total: 40 files (13 backend + 26 frontend + 1 root README)'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 3: FILE-BY-FILE DEEP DIVE
  // =========================================================
  sections.push(
    heading('3. File-by-File Deep Dive', 1),
    para('Every file in the project explained with its purpose, key code elements, and how it connects to other files.'),
    emptyLine(),

    // --- BACKEND FILES ---
    heading('3.1 Backend Files', 2),

    subheading('README.md (Root)'),
    para('The project-level documentation file. Contains the project description, feature list, tech stack table, complete folder structure diagram, API endpoint reference table, step-by-step installation instructions (database setup, environment config, backend install, frontend install), sample account credentials, and extension ideas. This is the first file anyone sees when they open the project on GitHub.'),
    emptyLine(),

    subheading('backend/.env'),
    para('Environment variables configuration file. Contains PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, and JWT_EXPIRES_IN. This file is NOT committed to version control (it is in .gitignore in production). The backend uses dotenv to load these variables into process.env at startup.'),
    emptyLine(),

    subheading('backend/package.json'),
    para('Defines the backend project metadata and dependencies. Key dependencies: express (web framework), mysql2 (MySQL driver with promises), bcryptjs (password hashing), jsonwebtoken (JWT creation/verification), cors (cross-origin requests), dotenv (environment variables). Dev dependency: nodemon (auto-restart on file changes). Scripts: "start" runs server.js, "dev" runs with nodemon.'),
    emptyLine(),

    subheading('backend/server.js'),
    para('The entry point for the Express.js server. It: (1) Loads environment variables with dotenv, (2) Creates an Express app instance, (3) Registers middleware: cors() for cross-origin requests and express.json() for JSON body parsing, (4) Mounts route files: /api/auth routes from auth.js and /api/issues routes from issues.js, (5) Adds a /api/health check endpoint, (6) Registers a global error handler middleware, (7) Starts listening on PORT (default 5000). This is the central hub that wires together all backend components.'),
    emptyLine(),

    subheading('backend/config/db.js'),
    para('Database connection configuration. Creates a MySQL connection pool using mysql2.createPool() with settings from environment variables. The pool supports up to 10 concurrent connections. The exported promisePool (pool.promise()) allows using async/await syntax for database queries throughout the controllers. All database queries in the project go through this single connection point.'),
    emptyLine(),

    subheading('backend/middleware/auth.js'),
    para('Contains two Express middleware functions: authenticate and authorizeAdmin. authenticate() extracts the JWT token from the Authorization header (format: "Bearer <token>"), verifies it with jwt.verify() using the JWT_SECRET, and attaches the decoded user object (id, name, email, role) to req.user. If verification fails, it returns 401. authorizeAdmin() checks if req.user.role === "Admin" and returns 403 if not. These are used to protect routes in the issues router.'),
    emptyLine(),

    subheading('backend/controllers/authController.js'),
    para('Handles three operations:'),
    bullet('register: Validates name/email/password, checks for duplicate email with a SELECT query, hashes the password with bcrypt (10 salt rounds via genSalt), inserts the user with default role "User", generates a JWT token with user payload (id, name, email, role), and returns 201 with the token and user object.'),
    bullet('login: Finds user by email with SELECT, compares password with bcrypt.compare(), generates a JWT token on success, returns 200 with token and user object. Returns 401 on invalid credentials.'),
    bullet('getMe: Protected route that uses req.user.id (set by auth middleware) to fetch the user profile from the database and return it. Used by AuthContext to verify tokens on page refresh.'),
    emptyLine(),

    subheading('backend/controllers/issueController.js'),
    para('Handles five operations:'),
    bullet('getAllIssues: If user is Admin, JOINs issues with users to get reporter_name and returns all issues. If regular user, filters by user_id. Both ordered by created_at DESC.'),
    bullet('getIssueById: Fetches a single issue with JOIN for reporter_name. Checks authorization: Admin can view any issue, users can only view their own. Also fetches all related updates ordered by updated_at ASC.'),
    bullet('createIssue: Validates required fields (title, description, category, location) and checks category against a whitelist. Inserts with default status "Pending". Returns 201 with the created issue summary.'),
    bullet('updateIssueStatus (Admin only): Validates the new status against a whitelist, checks issue exists, updates the issue status, and if an admin message is provided, inserts it into the updates table.'),
    bullet('getStats (Admin only): Returns total issues count, issues grouped by status, and total users count. Used for admin dashboard statistics.'),
    emptyLine(),

    subheading('backend/routes/auth.js'),
    para('Defines three auth endpoints using Express Router: POST /register maps to authController.register, POST /login maps to authController.login, GET /me uses authenticate middleware then maps to authController.getMe. All routes are prefixed with /api/auth in server.js.'),
    emptyLine(),

    subheading('backend/routes/issues.js'),
    para('Defines six issue endpoints using Express Router. All routes are protected with authenticate middleware applied via router.use(authenticate). Endpoints: GET / (getAllIssues), GET /stats (authorizeAdmin + getStats), GET /:id (getIssueById), POST / (createIssue), PUT /:id/status (authorizeAdmin + updateIssueStatus). All routes are prefixed with /api/issues in server.js.'),
    emptyLine(),

    subheading('backend/schema.sql'),
    para('The MySQL database definition file. Contains: CREATE DATABASE IF NOT EXISTS civicconnect, three CREATE TABLE statements (users with id, name, email, password, role, created_at; issues with id, title, description, category, location, status, user_id, created_at and foreign key to users; updates with id, issue_id, message, updated_at and foreign key to issues), plus sample data: 3 users (2 regular + 1 admin with bcrypt-hashed passwords for "password123"), 4 sample issues across different categories, 3 sample updates.'),
    new PageBreak(),

    // --- FRONTEND FILES ---
    heading('3.2 Frontend Files', 2),

    subheading('frontend/package.json'),
    para('React application configuration. Dependencies: react 18, react-dom 18, react-router-dom 6 (client-side routing), react-scripts 5 (build tooling from Create React App). Scripts: "start" runs dev server, "build" creates production build. React-scripts manages Webpack, Babel, and other tooling.'),
    emptyLine(),

    subheading('frontend/public/index.html'),
    para('The HTML template that React renders into. Contains a minimal HTML5 document with viewport meta tag for responsive design, a meta description for SEO, and a single <div id="root"></div> element where React mounts the application. The title is set to "CivicConnect - Community Issue Reporting".'),
    emptyLine(),

    subheading('frontend/src/index.js'),
    para('React entry point. Uses createRoot (React 18 API) to render the <App /> component inside <React.StrictMode> into the DOM element with id="root". Imports index.css for global styles. This is the smallest file - it just boots up the React application.'),
    emptyLine(),

    subheading('frontend/src/index.css'),
    para('Global stylesheet defining the entire design system. Sets up CSS custom properties (variables) in :root for consistent theming: primary colors (blue palette), semantic colors (success green, warning yellow, danger red), background colors, text colors, shadows, border radius. Defines base element styles (body, links), layout utilities (.container, .page-wrapper), card component, button system (.btn, .btn-primary, .btn-success, .btn-danger, .btn-outline), form styles (.form-group, .form-input, .form-select, .form-textarea), status badges (.status-badge, .status-pending, .status-inprogress, .status-resolved), alerts (.alert-error, .alert-success), page headers, and responsive grid system. Mobile responsive with a max-width: 768px media query.'),
    emptyLine(),

    subheading('frontend/src/App.js'),
    para('The root React component. Contains three main parts:'),
    bullet('AppContent: The main layout component that uses useAuth() to get auth state. Shows a loading screen while checking auth. Wraps everything in BrowserRouter, Navbar, and a container div. Defines all Routes: / (landing or redirect based on auth), /login (redirects to dashboard if already logged in), /register, /dashboard (protected), /report (protected), /issues/:id (protected), /admin (protected + adminOnly), and a catch-all redirect to /.'),
    bullet('LandingPage: A simple component for unauthenticated users showing a welcome message and Get Started / Log In buttons.'),
    bullet('App (exported): Wraps AppContent inside AuthProvider so all components have access to auth state.'),
    emptyLine(),

    subheading('frontend/src/App.css'),
    para('Styles for the loading screen (centered spinner), landing page (centered hero section with title, description, buttons), and landing button layout.'),
    emptyLine(),

    subheading('frontend/src/context/AuthContext.js'),
    para('Authentication state management using React Context API. Creates an AuthContext with createContext. The AuthProvider component: (1) Maintains user state and loading state, (2) On mount, checks localStorage for a stored token and calls getProfile() API to verify it, (3) Provides login(token, userData) function that saves token to localStorage and sets user state, (4) Provides logout() function that removes token and clears user state. Exports useAuth() custom hook that throws an error if used outside AuthProvider. This is the central auth state that all components read from.'),
    emptyLine(),

    subheading('frontend/src/services/api.js'),
    para('Centralized API client. Defines API_URL from process.env.REACT_APP_API_URL with fallback to localhost:5000/api. Contains helper functions: getToken() reads from localStorage, getHeaders() creates JSON headers with optional Bearer token, handleResponse() parses JSON and throws on HTTP errors. Exports six API functions: registerUser (POST /auth/register), loginUser (POST /auth/login), getProfile (GET /auth/me), getAllIssues (GET /issues), getIssueById (GET /issues/:id), createIssue (POST /issues), updateIssueStatus (PUT /issues/:id/status), getIssueStats (GET /issues/stats). All authenticated functions automatically attach the JWT token.'),
    emptyLine(),

    subheading('frontend/src/components/Navbar.js'),
    para('Sticky navigation bar displayed on every page. When user is logged in: shows Dashboard, Report Issue, Admin Panel (if admin) links, user name badge, and Logout button. When logged out: shows Login link and Sign Up button. Uses useAuth() for user state and logout function. Uses useNavigate() for redirect after logout. Brand shows a scales icon + "CivicConnect" text that links to home.'),
    emptyLine(),

    subheading('frontend/src/components/IssueCard.js'),
    para('Reusable card component that displays an issue summary. Renders as a Link to /issues/:id. Shows: issue title, status badge (with dynamic CSS class based on status value), truncated description (120 chars max + ellipsis), metadata row (category, location, date), and reporter name (only when present - for admin view). Uses Link from react-router-dom for navigation.'),
    emptyLine(),

    subheading('frontend/src/components/PrivateRoute.js'),
    para('Route guard component. Takes children and an optional adminOnly prop. If user is not authenticated, redirects to /login using Navigate. If adminOnly is true and user role is not Admin, redirects to /dashboard. Otherwise renders the children. This wraps protected pages in App.js route definitions.'),
    emptyLine(),

    subheading('frontend/src/pages/Login.js'),
    para('Login form page. Manages form state for email and password, error state, and loading state. On submit: calls loginUser API, then calls authContext.login() to save the token and update global auth state, then navigates to /admin if the user is an admin or /dashboard otherwise. Shows error alerts for invalid credentials. Links to Register page for new users. Uses Login.css for styling.'),
    emptyLine(),

    subheading('frontend/src/pages/Register.js'),
    para('Registration form page. Manages form state for name, email, password, and confirmPassword. Client-side validation: checks password match and minimum 6 characters before submitting. On submit: calls registerUser API, auto-logs in (calls authContext.login), navigates to dashboard. Reuses Login.css for styling since the form layout is identical.'),
    emptyLine(),

    subheading('frontend/src/pages/Dashboard.js'),
    para('User dashboard page. Fetches all user issues on mount using getAllIssues(). Displays: 4 stat cards (All, Pending, In Progress, Resolved) with counts that act as filter tabs, a section header with "Report New Issue" button, and a list of IssueCard components filtered by the selected status. Shows empty state with "Report Your First Issue" button when no issues match the filter. Uses useAuth() to greet the user by name.'),
    emptyLine(),

    subheading('frontend/src/pages/ReportIssue.js'),
    para('Issue reporting form. Manages form state for title, description, category (select dropdown with 5 options), and location. Client-side validation checks all fields are filled. On submit: calls createIssue API and navigates to dashboard on success. Has Cancel button that goes back to dashboard. Clean form layout in a card.'),
    emptyLine(),

    subheading('frontend/src/pages/IssueDetails.js'),
    para('Full issue detail view. Uses useParams() to get the issue ID from the URL. Fetches issue data and updates on mount using getIssueById(id). Displays: back link to dashboard, issue card with title, status badge, metadata grid (category, location, reporter, date), full description, and an updates timeline section. Each update shows a numbered circle indicator, message text, and formatted date/time. Shows "No updates yet" message when updates array is empty.'),
    emptyLine(),

    subheading('frontend/src/pages/AdminDashboard.js'),
    para('Admin management panel. Fetches all issues on mount. Shows: 4 stat filter cards (same pattern as Dashboard), a table view of issues with columns (ID, Title, Category, Location, Reporter, Status, Date, Action), and an "Update" button per row that opens a modal. The modal allows admins to change the status (select dropdown with 3 options) and add optional admin remarks (textarea). On submit, calls updateIssueStatus API and refreshes the issue list. Modal closes on overlay click, X button, or Cancel.'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 4: ARCHITECTURE
  // =========================================================
  sections.push(
    heading('4. Architecture & Component Connections', 1),

    heading('4.1 High-Level Architecture', 2),
    para('CivicConnect follows a traditional 3-tier architecture:'),
    emptyLine(),
    createTable(
      ['Tier', 'Technology', 'Location', 'Responsibility'],
      [
        ['Presentation', 'React.js SPA', 'Frontend (port 3000)', 'Renders UI, manages client state, routes pages'],
        ['Application', 'Express.js REST API', 'Backend (port 5000)', 'Handles HTTP requests, business logic, auth'],
        ['Data', 'MySQL Database', 'Database server', 'Stores users, issues, and updates'],
      ]
    ),
    emptyLine(),

    heading('4.2 Request Flow (End to End)', 2),
    boldPara('Step-by-step what happens when a user reports an issue:'),
    numberedItem('User fills out the Report Issue form in React'),
    numberedItem('React captures form data in component state (useState)'),
    numberedItem('User clicks Submit, calling handleSubmit()'),
    numberedItem('handleSubmit() calls createIssue(formData) from api.js'),
    numberedItem('api.js sends a POST request to http://localhost:5000/api/issues with JSON body and JWT token in Authorization header'),
    numberedItem('Express server receives the request at the /api/issues route'),
    numberedItem('The authenticate middleware runs first, verifying the JWT token and attaching user info to req.user'),
    numberedItem('The route handler calls createIssue controller function'),
    numberedItem('The controller validates fields, checks category whitelist, runs INSERT query on MySQL'),
    numberedItem('MySQL inserts the row and returns the new ID'),
    numberedItem('Controller sends 201 JSON response back'),
    numberedItem('React receives the response, navigate() redirects to /dashboard'),
    numberedItem('Dashboard component re-mounts, fetches fresh issues list via getAllIssues()'),
    numberedItem('Issues render as IssueCard components'),
    emptyLine(),

    heading('4.3 Component Tree (Frontend)', 2),
    codeLine('<App>                                              # Root component'),
    codeLine('  <AuthProvider>                                   # Provides auth context globally'),
    codeLine('    <AppContent>                                   # Uses auth context'),
    codeLine('      <BrowserRouter>                              # Client-side routing'),
    codeLine('        <Navbar />                                 # Shows login/logout based on auth'),
    codeLine('        <Routes>'),
    codeLine('          <Route path="/login" -> <Login />        # Login form'),
    codeLine('          <Route path="/register" -> <Register />  # Registration form'),
    codeLine('          <Route path="/dashboard" ->              # Protected route'),
    codeLine('            <PrivateRoute>'),
    codeLine('              <Dashboard>                          # User issues + filters'),
    codeLine('                <IssueCard />                      # Repeated per issue'),
    codeLine('                <IssueCard />'),
    codeLine('          <Route path="/report" ->                 # Protected route'),
    codeLine('            <PrivateRoute>'),
    codeLine('              <ReportIssue />                      # Issue form'),
    codeLine('          <Route path="/issues/:id" ->             # Protected route'),
    codeLine('            <PrivateRoute>'),
    codeLine('              <IssueDetails />                     # Full issue + updates'),
    codeLine('          <Route path="/admin" ->                  # Protected + adminOnly'),
    codeLine('            <PrivateRoute adminOnly>'),
    codeLine('              <AdminDashboard />                   # Table + modal'),
    codeLine('        </Routes>'),
    codeLine('      </BrowserRouter>'),
    codeLine('    </AppContent>'),
    codeLine('  </AuthProvider>'),
    codeLine('</App>'),
    emptyLine(),

    heading('4.4 Data Flow Diagram', 2),
    para('How data moves between files:'),
    emptyLine(),
    createTable(
      ['Direction', 'Source File', 'Target File', 'What is Passed'],
      [
        ['Import', 'index.js', 'App.js', 'App component'],
        ['Import', 'App.js', 'AuthContext.js', 'AuthProvider, useAuth'],
        ['Import', 'App.js', 'components/*, pages/*', 'All components'],
        ['Import', 'App.js', 'react-router-dom', 'Router, Routes, Route, Navigate, Link'],
        ['Import', 'AuthContext.js', 'api.js', 'getProfile function'],
        ['Import', 'api.js', '(fetch)', 'backend server.js', 'HTTP requests with JWT'],
        ['Import', 'Login.js', 'api.js', 'loginUser function'],
        ['Import', 'Login.js', 'AuthContext.js', 'useAuth (login function)'],
        ['Import', 'Dashboard.js', 'api.js', 'getAllIssues function'],
        ['Import', 'Dashboard.js', 'AuthContext.js', 'useAuth (user object)'],
        ['Import', 'Dashboard.js', 'IssueCard.js', 'IssueCard component'],
        ['Import', 'server.js', 'routes/auth.js', 'Express Router mounting'],
        ['Import', 'server.js', 'routes/issues.js', 'Express Router mounting'],
        ['Import', 'routes/auth.js', 'controllers/authController.js', 'Controller functions'],
        ['Import', 'routes/issues.js', 'controllers/issueController.js', 'Controller functions'],
        ['Import', 'routes/issues.js', 'middleware/auth.js', 'Middleware functions'],
        ['Import', 'controllers/*.js', 'config/db.js', 'Database pool'],
      ]
    ),
    new PageBreak()
  );

  // =========================================================
  // SECTION 5: DATABASE SCHEMA
  // =========================================================
  sections.push(
    heading('5. Database Schema & Relationships', 1),

    heading('5.1 Entity Relationship Diagram', 2),
    para('The database has three tables with the following relationships:'),
    emptyLine(),
    codeLine('  users (1) ---< (N) issues   [user_id foreign key]'),
    codeLine('  issues (1) ---< (N) updates [issue_id foreign key]'),
    emptyLine(),
    para('A user can have many issues. An issue can have many updates. Both relationships use CASCADE delete (deleting a user deletes their issues; deleting an issue deletes its updates).'),
    emptyLine(),

    heading('5.2 Users Table', 2),
    createTable(
      ['Column', 'Type', 'Constraints', 'Description'],
      [
        ['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique user identifier'],
        ['name', 'VARCHAR(100)', 'NOT NULL', 'User full name'],
        ['email', 'VARCHAR(100)', 'NOT NULL, UNIQUE', 'Login email address'],
        ['password', 'VARCHAR(255)', 'NOT NULL', 'bcrypt hashed password'],
        ['role', "ENUM('User','Admin')", "DEFAULT 'User'", 'Authorization level'],
        ['created_at', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Account creation date'],
      ]
    ),
    emptyLine(),

    heading('5.3 Issues Table', 2),
    createTable(
      ['Column', 'Type', 'Constraints', 'Description'],
      [
        ['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique issue identifier'],
        ['title', 'VARCHAR(200)', 'NOT NULL', 'Short issue title'],
        ['description', 'TEXT', 'NOT NULL', 'Detailed issue description'],
        ['category', "ENUM('Pothole','Streetlight','Garbage','Water Leakage','Other')", 'NOT NULL', 'Issue category'],
        ['location', 'VARCHAR(255)', 'NOT NULL', 'Physical location of issue'],
        ['status', "ENUM('Pending','In Progress','Resolved')", "DEFAULT 'Pending'", 'Current issue status'],
        ['user_id', 'INT', 'NOT NULL, FOREIGN KEY -> users(id)', 'Reporter (who reported this)'],
        ['created_at', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Date reported'],
      ]
    ),
    emptyLine(),

    heading('5.4 Updates Table', 2),
    createTable(
      ['Column', 'Type', 'Constraints', 'Description'],
      [
        ['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique update identifier'],
        ['issue_id', 'INT', 'NOT NULL, FOREIGN KEY -> issues(id)', 'Which issue this update belongs to'],
        ['message', 'TEXT', 'NOT NULL', 'Admin remarks / status notes'],
        ['updated_at', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'When this update was added'],
      ]
    ),
    emptyLine(),

    heading('5.5 Sample Data', 2),
    para('The schema.sql file includes sample data for testing:'),
    bullet('3 users: John Doe (User), Jane Smith (User), Admin User (Admin) - all with password "password123"'),
    bullet('4 issues: 2 by John (Pothole pending, Streetlight in progress), 2 by Jane (Garbage resolved, Water Leakage pending)'),
    bullet('3 updates: 2 for the Streetlight issue (work order filed, electrician dispatched), 1 for Garbage (resolved)'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 6: API ENDPOINTS
  // =========================================================
  sections.push(
    heading('6. API Endpoints Reference', 1),

    heading('6.1 Endpoint Summary', 2),
    createTable(
      ['Method', 'Endpoint', 'Auth', 'Role', 'Description'],
      [
        ['POST', '/api/auth/register', 'No', '-', 'Create a new user account'],
        ['POST', '/api/auth/login', 'No', '-', 'Log in to existing account'],
        ['GET', '/api/auth/me', 'Yes', 'Any', 'Get current user profile'],
        ['GET', '/api/health', 'No', '-', 'Server health check'],
        ['GET', '/api/issues', 'Yes', 'Any', 'Get issues (filtered by role)'],
        ['GET', '/api/issues/:id', 'Yes', 'Any', 'Get single issue + updates'],
        ['POST', '/api/issues', 'Yes', 'Any', 'Create a new issue'],
        ['PUT', '/api/issues/:id/status', 'Yes', 'Admin', 'Update issue status'],
        ['GET', '/api/issues/stats', 'Yes', 'Admin', 'Get summary statistics'],
      ]
    ),
    emptyLine(),

    heading('6.2 Detailed Endpoint Specifications', 2),

    subheading('POST /api/auth/register'),
    bullet('Request Body: { "name": "string", "email": "string", "password": "string" }'),
    bullet('Success Response (201): { "message": "User registered successfully.", "token": "jwt_string", "user": { id, name, email, role } }'),
    bullet('Error Responses: 400 (missing fields or duplicate email), 500 (server error)'),
    bullet('Backend Logic: Validate -> Check duplicate -> Hash password -> Insert user -> Generate JWT -> Return'),
    emptyLine(),

    subheading('POST /api/auth/login'),
    bullet('Request Body: { "email": "string", "password": "string" }'),
    bullet('Success Response (200): { "message": "Login successful.", "token": "jwt_string", "user": { id, name, email, role } }'),
    bullet('Error Responses: 400 (missing fields), 401 (invalid credentials), 500 (server error)'),
    bullet('Backend Logic: Find user -> Compare password -> Generate JWT -> Return'),
    emptyLine(),

    subheading('GET /api/auth/me'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Success Response (200): { "user": { id, name, email, role, created_at } }'),
    bullet('Error Responses: 401 (invalid token), 404 (user not found)'),
    bullet('Backend Logic: Verify JWT -> Query user by id -> Return user (without password)'),
    emptyLine(),

    subheading('GET /api/issues'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Success Response (200): { "issues": [ { id, title, description, category, location, status, user_id, created_at, reporter_name? } ] }'),
    bullet('Note: Admin gets all issues with reporter_name. Regular user only gets their own issues.'),
    emptyLine(),

    subheading('GET /api/issues/:id'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Success Response (200): { "issue": { ... }, "updates": [ { id, issue_id, message, updated_at } ] }'),
    bullet('Backend Logic: Fetch issue with JOIN -> Check authorization -> Fetch updates -> Return both'),
    emptyLine(),

    subheading('POST /api/issues'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Request Body: { "title": "string", "description": "string", "category": "string", "location": "string" }'),
    bullet('Success Response (201): { "message": "Issue reported successfully.", "issue": { id, title, description, category, location, status, user_id } }'),
    emptyLine(),

    subheading('PUT /api/issues/:id/status (Admin only)'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Request Body: { "status": "Pending|In Progress|Resolved", "message": "optional admin remark" }'),
    bullet('Success Response (200): { "message": "Issue status updated successfully." }'),
    emptyLine(),

    subheading('GET /api/issues/stats (Admin only)'),
    bullet('Headers: Authorization: Bearer <token>'),
    bullet('Success Response (200): { "totalIssues": number, "totalUsers": number, "statusCounts": [ { status, count } ] }'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 7: WORKFLOWS
  // =========================================================
  sections.push(
    heading('7. User Workflows (Step-by-Step)', 1),

    heading('7.1 Registration Workflow', 2),
    boldPara('Starting state: User is on the landing page (not logged in).'),
    numberedItem('User clicks "Get Started" or navigates to /register'),
    numberedItem('Register page renders with form fields: Full Name, Email, Password, Confirm Password'),
    numberedItem('User fills in details and clicks "Sign Up"'),
    numberedItem('Client-side validation runs: checks passwords match, minimum 6 characters'),
    numberedItem('If validation fails, error message displays, form does not submit'),
    numberedItem('If validation passes, api.js sends POST /api/auth/register'),
    numberedItem('Backend validates fields, checks email uniqueness, hashes password with bcrypt'),
    numberedItem('Backend inserts user into MySQL with role="User", generates JWT token'),
    numberedItem('Returns 201 with token and user object'),
    numberedItem('React receives response, calls authContext.login(token, user)'),
    numberedItem('AuthContext saves token to localStorage, sets user state'),
    numberedItem('Navbar re-renders showing logged-in links'),
    numberedItem('User is redirected to /dashboard'),
    emptyLine(),

    heading('7.2 Login Workflow', 2),
    boldPara('Starting state: User is on the landing page or login page.'),
    numberedItem('User clicks "Log In" or navigates to /login'),
    numberedItem('Login page renders with Email and Password fields'),
    numberedItem('User enters credentials and clicks "Log In"'),
    numberedItem('api.js sends POST /api/auth/login'),
    numberedItem('Backend queries user by email, compares password with bcrypt.compare()'),
    numberedItem('If credentials match, generates JWT token and returns it'),
    numberedItem('If invalid, returns 401 "Invalid email or password"'),
    numberedItem('On success, authContext.login() saves token and user'),
    numberedItem('User is redirected: Admin -> /admin, Regular User -> /dashboard'),
    emptyLine(),

    heading('7.3 Report Issue Workflow', 2),
    boldPara('Starting state: User is logged in and on the dashboard.'),
    numberedItem('User clicks "Report New Issue" button or navigates to /report'),
    numberedItem('ReportIssue page renders with form: Title, Description, Category (dropdown), Location'),
    numberedItem('User fills in all fields, selects a category, and clicks "Submit Report"'),
    numberedItem('Client-side validation: checks all fields are filled'),
    numberedItem('On submit, api.js sends POST /api/issues with JWT token in headers'),
    numberedItem('Backend authenticate middleware verifies JWT, attaches user to req'),
    numberedItem('Controller validates fields, checks category whitelist'),
    numberedItem('Inserts issue with user_id from JWT, status defaults to "Pending"'),
    numberedItem('Returns 201 with the created issue summary'),
    numberedItem('React navigates to /dashboard'),
    numberedItem('Dashboard re-fetches issues (now shows the new one)'),
    emptyLine(),

    heading('7.4 Admin Update Status Workflow', 2),
    boldPara('Starting state: Admin is logged in and on the Admin Dashboard.'),
    numberedItem('Admin views all issues in a table with ID, Title, Category, Location, Reporter, Status, Date, Action'),
    numberedItem('Admin can filter by status using the stat cards (All/Pending/In Progress/Resolved)'),
    numberedItem('Admin clicks "Update" button on a specific issue row'),
    numberedItem('Modal opens showing: Issue ID, Title, Status dropdown (current status pre-selected), Admin Remarks textarea'),
    numberedItem('Admin selects new status and optionally adds remarks'),
    numberedItem('Admin clicks "Update Status"'),
    numberedItem('api.js sends PUT /api/issues/:id/status with JWT + adminOnly check'),
    numberedItem('Backend validates status whitelist, checks issue exists'),
    numberedItem('Updates issue.status in MySQL, inserts update message if provided'),
    numberedItem('Returns 200 success'),
    numberedItem('Modal closes, issue list refreshes showing updated status'),
    emptyLine(),

    heading('7.5 Session Restoration Workflow (Page Refresh)', 2),
    boldPara('Starting state: User has a valid token in localStorage and refreshes the page.'),
    numberedItem('Browser refreshes, React app re-initializes'),
    numberedItem('AuthContext mounts, checks localStorage for "token"'),
    numberedItem('Finds a token, sets loading=true, calls getProfile() API'),
    numberedItem('api.js sends GET /api/auth/me with the stored token'),
    numberedItem('Backend verifies token (validates signature and expiration)'),
    numberedItem('If valid, returns user profile data'),
    numberedItem('AuthContext sets user state with profile data, loading=false'),
    numberedItem('AppContent re-renders with user logged in'),
    numberedItem('If token is expired/invalid, API returns 401'),
    numberedItem('AuthContext removes token from localStorage, sets user=null, loading=false'),
    numberedItem('User sees the landing page/login page'),
    emptyLine(),

    heading('7.6 Logout Workflow', 2),
    numberedItem('User clicks "Logout" button in the Navbar'),
    numberedItem('handleLogout() calls authContext.logout()'),
    numberedItem('logout() removes "token" from localStorage'),
    numberedItem('logout() sets user state to null'),
    numberedItem('useNavigate() redirects to the landing page (/)'),
    numberedItem('Navbar re-renders showing Login and Sign Up links'),
    numberedItem('All protected routes now redirect to /login'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 8: AUTHENTICATION DEEP DIVE
  // =========================================================
  sections.push(
    heading('8. Authentication Flow (JWT Deep Dive)', 1),

    heading('8.1 What is JWT?', 2),
    para('JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. In CivicConnect, JWT tokens are used for stateless authentication - the server does not need to store session data. All user identity information is encoded in the token itself.'),
    emptyLine(),

    heading('8.2 JWT Structure', 2),
    para('A JWT token has three parts separated by dots:'),
    codeLine('header.payload.signature'),
    emptyLine(),
    bullet('Header: Contains the algorithm (HS256) and token type (JWT)'),
    bullet('Payload: Contains the claims - in our case: { id, name, email, role, iat (issued at), exp (expiration) }'),
    bullet('Signature: Created by hashing the header + payload with the secret key (JWT_SECRET)'),
    emptyLine(),

    heading('8.3 Token Creation (Login/Register)', 2),
    codeBlock('jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })'),
    para('When a user logs in or registers successfully, the backend creates a token with the user id, name, email, and role as the payload. The token expires in 7 days (configurable via JWT_EXPIRES_IN in .env). The secret key is stored in the .env file.'),
    emptyLine(),

    heading('8.4 Token Verification (Middleware)', 2),
    codeBlock('jwt.verify(token, JWT_SECRET)'),
    para('When a protected API route is called, the authenticate middleware: (1) Extracts the token from the Authorization header (format: "Bearer <token>"), (2) Calls jwt.verify() with the secret key, (3) If valid, attaches the decoded payload to req.user, (4) If invalid/expired, returns 401. This happens on every protected request.'),
    emptyLine(),

    heading('8.5 Token Storage (Frontend)', 2),
    para('The token is stored in the browser localStorage under the key "token". This is persistent across browser sessions (unlike sessionStorage which clears on tab close). The token is retrieved by api.js for every API call via localStorage.getItem("token").'),
    emptyLine(),

    heading('8.6 Security Considerations', 2),
    bullet('Passwords are never stored in plain text - they are hashed with bcrypt (10 salt rounds)'),
    bullet('The JWT secret should be a long, random string in production'),
    bullet('Tokens have a 7-day expiration limit'),
    bullet('The token is sent only in HTTP headers (never in URLs)'),
    bullet('Admin routes have double protection: authenticate + authorizeAdmin middleware'),
    bullet('XSS protection: token is in localStorage (vulnerable to XSS - for production, httpOnly cookies are recommended)'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 9: SETUP GUIDE
  // =========================================================
  sections.push(
    heading('9. Complete Setup & Installation Guide', 1),

    heading('9.1 Prerequisites', 2),
    bullet('Node.js v16 or later installed'),
    bullet('MySQL v8 installed and running'),
    bullet('A code editor (VS Code recommended)'),
    bullet('npm (comes with Node.js)'),
    emptyLine(),

    heading('9.2 Step 1: Set Up the Database', 2),
    numberedItem('Open MySQL (command line or MySQL Workbench)'),
    numberedItem('Run the schema file to create the database, tables, and sample data:'),
    codeBlock('mysql -u root -p < backend/schema.sql'),
    numberedItem('Enter your MySQL password when prompted'),
    numberedItem('Verify with: SHOW DATABASES; (should see "civicconnect")'),
    emptyLine(),

    heading('9.3 Step 2: Configure Environment', 2),
    numberedItem('Navigate to the backend directory: cd backend'),
    numberedItem('Open the .env file'),
    numberedItem('Set your MySQL credentials:'),
    codeBlock('DB_HOST=localhost'),
    codeBlock('DB_USER=root'),
    codeBlock('DB_PASSWORD=your_mysql_password'),
    codeBlock('DB_NAME=civicconnect'),
    codeBlock('JWT_SECRET=your_random_secret_string'),
    codeBlock('JWT_EXPIRES_IN=7d'),
    emptyLine(),

    heading('9.4 Step 3: Install and Start Backend', 2),
    numberedItem('Install dependencies: cd backend && npm install'),
    numberedItem('Start the server: npm start (or npm run dev for auto-restart)'),
    numberedItem('Verify: Visit http://localhost:5000/api/health in browser'),
    numberedItem('Expected response: { "message": "CivicConnect API is running!" }'),
    emptyLine(),

    heading('9.5 Step 4: Install and Start Frontend', 2),
    numberedItem('Open a NEW terminal window'),
    numberedItem('Install dependencies: cd frontend && npm install'),
    numberedItem('Start the React dev server: npm start'),
    numberedItem('The browser automatically opens at http://localhost:3000'),
    emptyLine(),

    heading('9.6 Step 5: Log In with Sample Accounts', 2),
    para('After completing setup, you can log in with these pre-created accounts:'),
    emptyLine(),
    createTable(
      ['Email', 'Password', 'Role', 'What You Can Do'],
      [
        ['john@example.com', 'password123', 'User', 'Report issues, view own issues'],
        ['jane@example.com', 'password123', 'User', 'Report issues, view own issues'],
        ['admin@civicconnect.com', 'password123', 'Admin', 'View all issues, update statuses'],
      ]
    ),
    new PageBreak()
  );

  // =========================================================
  // SECTION 10: INTERVIEW Q&A
  // =========================================================
  sections.push(
    heading('10. Interview Preparation Q&A', 1),
    para('Common interview questions with detailed answers to help you present this project confidently.'),
    emptyLine(),

    subheading('Q1: Why did you choose this tech stack?'),
    para('I chose React for the frontend because it is component-based, making the code modular and reusable. Express.js was chosen for the backend because it is lightweight and perfect for REST APIs. MySQL was chosen because it is a widely-used relational database that demonstrates my understanding of SQL concepts like joins, foreign keys, and indexes. JWT was chosen for authentication because it is stateless, meaning the server does not need to maintain session data, making it scalable.'),
    emptyLine(),

    subheading('Q2: How does authentication work in this project?'),
    para('Authentication uses JWT (JSON Web Tokens). When a user registers or logs in, the backend creates a signed JWT containing the user id, name, email, and role. This token is sent to the frontend, which stores it in localStorage. For every subsequent API call, the frontend includes the token in the Authorization header. The backend verifies this token on every protected route using the authenticate middleware. If the token is expired or invalid, the request is rejected with a 401 status. On page refresh, the frontend checks localStorage for a token and calls GET /api/auth/me to verify it is still valid and get the user profile.'),
    emptyLine(),

    subheading('Q3: How did you handle authorization (role-based access)?'),
    para('Authorization is handled at two levels. First, the authenticate middleware verifies the user is logged in. Second, the authorizeAdmin middleware checks if the user role is "Admin". Admin-only endpoints like updating issue status and viewing statistics use both middlewares. On the frontend, the PrivateRoute component checks the user role and redirects non-admin users away from the admin panel. The Navbar conditionally shows the Admin Panel link only to admin users.'),
    emptyLine(),

    subheading('Q4: How did you prevent SQL injection?'),
    para('I used parameterized queries with the mysql2 library. Instead of concatenating user input into SQL strings, I use placeholder ? markers and pass the values separately. For example: db.query("SELECT * FROM users WHERE email = ?", [email]). The mysql2 library sanitizes these inputs before executing the query, preventing SQL injection attacks. The project never uses string concatenation for SQL queries.'),
    emptyLine(),

    subheading('Q5: How did you handle password security?'),
    para('Passwords are never stored in plain text. I use bcryptjs to hash passwords with 10 salt rounds (generated via bcrypt.genSalt(10)). This means even if the database is compromised, the actual passwords are not exposed. Bcrypt is a deliberately slow hash function designed for passwords, making brute force attacks impractical. The salt ensures that identical passwords produce different hashes.'),
    emptyLine(),

    subheading('Q6: How does the frontend communicate with the backend?'),
    para('The frontend communicates with the backend via HTTP requests through a centralized api.js service. This service uses the native fetch API to make RESTful calls. It automatically attaches the JWT token from localStorage to the Authorization header for authenticated requests. All API responses are standardized JSON. The service handles errors uniformly by checking response.ok and throwing descriptive error messages from the backend.'),
    emptyLine(),

    subheading('Q7: How do you manage state in this application?'),
    para('I use React Context API for global state management. The AuthContext provides authentication state (user object, login, logout, loading status) to the entire application. Component-level state is managed with useState hooks - for example, form inputs, filter selections, modal visibility, and loading/error states. Since this is a relatively small application, I chose Context over Redux to keep the code simple and beginner-friendly.'),
    emptyLine(),

    subheading('Q8: How did you handle errors?'),
    para('Errors are handled at multiple layers. The backend has try-catch blocks in every controller function, returning appropriate HTTP status codes (400 for validation errors, 401 for auth errors, 403 for permission errors, 404 for not found, 500 for server errors). There is also a global error handler middleware in server.js that catches any unhandled errors. The frontend catches errors in every API call, displays user-friendly error messages using alert components, and handles edge cases like empty states (no issues found) with dedicated UI messages.'),
    emptyLine(),

    subheading('Q9: What would you improve or add next?'),
    para('I would add: (1) Image uploads for issue photos using multer, (2) Email notifications when an issue status changes using Nodemailer, (3) Pagination for large issue lists, (4) A map view to visualize issue locations using Leaflet or Google Maps, (5) Unit tests with Jest for both frontend and backend, (6) Input sanitization to prevent XSS attacks, (7) Docker configuration for easy deployment, (8) Rate limiting to prevent API abuse, (9) Environment-specific configuration files, (10) GitHub Actions CI/CD pipeline for automated testing.'),
    emptyLine(),

    subheading('Q10: How would you deploy this application?'),
    para('For production deployment, I would: (1) Build the frontend with npm run build, which creates optimized static files, (2) Serve the static files from Express by configuring it to serve the frontend/build directory, (3) Use a production-grade database host like AWS RDS or a managed MySQL service, (4) Deploy the combined application to platforms like Heroku, Render, or a VPS, (5) Use environment variables for all configuration, (6) Add HTTPS with a free SSL certificate from Let\'s Encrypt, (7) Use a process manager like PM2 to keep the server running.'),
    emptyLine(),

    subheading('Q11: How is the frontend routing structured?'),
    para('Frontend routing uses React Router v6 with a BrowserRouter wrapping the entire app. Routes are defined in App.js within the AppContent component. Public routes (/login, /register) redirect authenticated users away. Protected routes (/dashboard, /report, /issues/:id) use the PrivateRoute component which checks authentication and redirects to /login if not authenticated. The /admin route additionally checks for admin role. The root route (/) redirects authenticated users to their appropriate dashboard and shows a landing page for unauthenticated users.'),
    emptyLine(),

    subheading('Q12: Why did you choose plain CSS instead of Tailwind or Bootstrap?'),
    para('I chose plain CSS for this project because: (1) It demonstrates a fundamental understanding of CSS without framework abstractions, (2) It keeps the project dependency-free and lightweight, (3) It allows complete control over the design system, (4) CSS custom properties (variables) provide the same theming benefits as Tailwind tokens, (5) For a learning project, it is better to understand pure CSS before using frameworks. The design is responsive using media queries and uses a consistent design language with CSS variables for colors, spacing, and shadows.'),
    new PageBreak()
  );

  // =========================================================
  // SECTION 11: EXTENDING THE PROJECT
  // =========================================================
  sections.push(
    heading('11. Extending the Project', 1),
    para('Ideas for extending CivicConnect to make it more impressive for your portfolio:'),
    emptyLine(),

    subheading('11.1 Feature Additions'),
    bullet('Image Uploads: Let users attach photos to issues using multer middleware and Cloudinary/S3 storage'),
    bullet('Email Notifications: Send email alerts when issue status changes using Nodemailer'),
    bullet('Map Integration: Display issue locations on an interactive map using Leaflet or Google Maps API'),
    bullet('Comments/Discussion: Allow users and admins to have threaded discussions on each issue'),
    bullet('Voting System: Let users upvote issues to show community support'),
    bullet('Notifications: In-app notification system for status changes (polling or WebSockets)'),
    bullet('Search: Add search functionality to find issues by title, location, or keyword'),
    emptyLine(),

    subheading('11.2 Technical Improvements'),
    bullet('TypeScript: Convert the codebase to TypeScript for type safety'),
    bullet('Unit Tests: Add Jest tests for backend controllers and React Testing Library for frontend components'),
    bullet('Docker: Containerize the app with Docker Compose (MySQL + Backend + Frontend)'),
    bullet('CI/CD: Set up GitHub Actions for automated testing and deployment'),
    bullet('Pagination: Add pagination for large issue lists (both API and frontend)'),
    bullet('Rate Limiting: Implement express-rate-limit to prevent API abuse'),
    bullet('Input Sanitization: Add XSS protection with DOMPurify or similar'),
    bullet('API Validation: Add express-validator for more robust request validation'),
    bullet('Logging: Add structured logging with Winston or Morgan'),
    emptyLine(),

    subheading('11.3 Deployment'),
    bullet('Build frontend: cd frontend && npm run build'),
    bullet('Configure Express to serve the build folder as static files'),
    bullet('Deploy to Render, Railway, Fly.io, or a VPS with PM2'),
    bullet('Set up a production MySQL database (AWS RDS, PlanetScale, etc.)'),
    bullet('Add HTTPS with a reverse proxy (Nginx + Let\'s Encrypt)'),
    emptyLine(),

    subheading('11.4 Learning Path After This Project'),
    bullet('Learn TypeScript to add type safety'),
    bullet('Learn Docker for containerization'),
    bullet('Learn testing with Jest and React Testing Library'),
    bullet('Learn CI/CD with GitHub Actions'),
    bullet('Learn cloud deployment (AWS, GCP, or Azure)'),
    bullet('Learn Next.js for server-side rendering'),
    bullet('Learn Prisma ORM for database management'),
    bullet('Learn WebSockets for real-time features'),
    new PageBreak()
  );

  return sections;
};

// ==============================
// Build the Document
// ==============================

const createDocument = async () => {
  const doc = new Document({
    title: 'CivicConnect - Complete PRD & Interview Preparation Guide',
    description: 'Comprehensive documentation for the CivicConnect civic issue reporting platform',
    styles: {
      default: {
        document: {
          run: {
            size: 22,
            font: 'Calibri',
            color: '2C3E50',
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'bullet-list',
          levels: [
            {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            },
          ],
        },
        {
          reference: 'numbered-list',
          levels: [
            {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: generateDocument(),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  
  const outputPath = path.join(__dirname, '..', 'CivicConnect_PRD_Interview_Guide.docx');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`\n=== PRD Document Generated Successfully! ===`);
  console.log(`File: ${outputPath}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB\n`);
};

createDocument().catch(console.error);
