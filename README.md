# TaskFlow

TaskFlow is a comprehensive employee and project management web application featuring a unified, secure login system that dynamically routes users to distinct role-based dashboards for administrators and staff.

System credentials are securely provisioned by administrators, allowing employees to log in, track their workloads, and create detailed project cards complete with custom timelines, priorities, and status updates. Meanwhile, administrators benefit from a centralized management portal that provides complete visibility into organization-wide employee profiles and all staff projects, enabling efficient oversight, account administration, and operational control.

## Features

### For Employees
- Secure login with credentials provisioned by an admin
- Personal dashboard showing only their own assigned projects
- Create, edit, and delete project cards
- Set project timelines (start/end dates), priority (Low/Medium/High), status (Not Started/In Progress/Completed/On Hold), and completion percentage
- Overdue project indicators

### For Admins
- Centralized dashboard with organization-wide KPIs (total employees, total projects, overdue projects, completion rate)
- Visual breakdown of project status and workload distribution by employee
- Full employee directory management (add, edit, remove employee records)
- Staff account management (create staff/admin logins, activate/deactivate accounts)
- Visibility into every project across the organization

### Platform
- Role-based access control with protected routes
- JWT-based authentication
- Rate-limited login endpoint to prevent brute-force attempts
- Passwords hashed with bcrypt

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Recharts (dashboard charts)
- Axios
- Lucide React (icons)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Helmet, express-rate-limit, express-mongo-sanitize for security

## Project Structure

```
TaskFlow/
├── Backend/
│   ├── models/
│   │   ├── login.js              # Staff/Admin schema
│   │   ├── project.js            # Project schema
│   │   └── employeeDetails.js    # Employee profile schema
│   ├── connectDb.js
│   ├── createFirstAdmin.js       # Script to seed the first admin account
│   ├── index.js                  # Express app & all API routes
│   └── .env.example
│
└── Frontend/
    ├── src/
    │   ├── components/           # Sidebar, layouts, shared UI
    │   ├── pages/                # Login, dashboards, employee & project pages
    │   ├── utils/                # API helpers
    │   └── App.jsx                # Route definitions
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v24.x recommended)
- A MongoDB database (local or Atlas)

### 1. Clone the repository

```bash
git clone <repository-url>
cd TaskFlow
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` based on `.env.example`:

```dotenv
MONGODB_URL="your-mongodb-connection-string"
JWT_SECRET="a-long-random-secret-string"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

Create the first admin account:

```bash
node createFirstAdmin.js
```

This creates an admin login (`staffId: admin1`) that you can use to sign in and start adding staff and employees from the dashboard. Change this password after your first login.

Start the backend server:

```bash
npm start
```

The API will run on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd Frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`. Vite is configured to proxy all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed for local development beyond setting `CLIENT_URL` in the backend `.env`.

### 4. Log in

Open `http://localhost:5173/login` and sign in with the admin credentials created in step 2, or with staff credentials created afterward from the Manage Staff section of the admin dashboard.

## API Overview

All endpoints are prefixed with `/api` and require a `Bearer <token>` in the `Authorization` header unless noted otherwise.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/staff/login` | Public | Log in and receive a JWT |
| POST | `/staff` | Admin | Create a staff/admin account |
| GET | `/staff` | Authenticated | List all staff |
| GET | `/staff/:id` | Authenticated | Get one staff member |
| PUT | `/staff/:id` | Admin | Update a staff member |
| DELETE | `/staff/:id` | Admin | Remove a staff member |
| POST | `/projects` | Authenticated | Create a project |
| GET | `/projects` | Authenticated | List projects (optionally filtered by `?staffId=`) |
| GET | `/projects/:id` | Authenticated | Get one project |
| PUT | `/projects/:id` | Authenticated | Update a project |
| DELETE | `/projects/:id` | Authenticated | Delete a project |
| POST | `/employees` | Admin | Add an employee profile |
| GET | `/employees` | Authenticated | List all employee profiles |
| GET | `/employees/:id` | Authenticated | Get one employee profile |
| PUT | `/employees/:id` | Admin | Update an employee profile |
| DELETE | `/employees/:id` | Admin | Remove an employee profile |

## Roles

- **Admin** (`isAdmin: true`): full access to staff, employee, and project management.
- **Staff**: access limited to their own project dashboard, identified by `staffId`.

## License

This project currently has no license specified. Add one (e.g. MIT) if you plan to share or open-source it.