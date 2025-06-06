# Task Management System - MERN Stack

A Role-Based Task Management System using the MERN stack that showcases secure, scalable, and maintainable full-stack application development.

## Features

- User authentication with JWT stored in HttpOnly cookies
- Role-based access control with 3 roles: Admin, Manager, and Employee
- Task creation, assignment, and management
- Dashboard with task statistics
- User management (Admin only)

## Tech Stack

- **MongoDB** with Mongoose
- **Express.js** for the backend
- **React.js** with Context API for state management
- **Node.js**
- **Tailwind CSS** for styling
- **JWT** for authentication
- **bcrypt** for password hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Backend Setup

1. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

2. Start the backend server:
   ```
   npm run dev
   ```

The backend server will run on http://localhost:5000.

### Frontend Setup

1. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

The frontend development server will run on http://localhost:5173.

## API Endpoints

### Auth APIs

| Method | Endpoint          | Description     | Access  |
|--------|-------------------|-----------------|---------|
| POST   | /api/auth/login    | Login user      | Public  |
| POST   | /api/auth/register | Register user   | Public  |
| POST   | /api/auth/logout   | Logout user     | Private |

### User APIs

| Method | Endpoint    | Description   | Access      |
|--------|-------------|---------------|-------------|
| GET    | /api/users  | List all users | Admin only  |
| GET    | /api/users/profile | Get user profile | Authenticated |
| GET    | /api/users/:id | Get user by ID | Admin only |

### Task APIs

| Method | Endpoint        | Description      | Access                |
|--------|-----------------|------------------|----------------------|
| POST   | /api/tasks      | Create a task    | Admin, Manager       |
| GET    | /api/tasks      | List tasks       | Authenticated users  |
| GET    | /api/tasks/:id  | Get task by ID   | Authenticated users  |
| PUT    | /api/tasks/:id  | Update a task    | Creator or Assignee  |
| DELETE | /api/tasks/:id  | Delete a task    | Admin only          |

## Environment Setup

### Backend Environment
Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5001
```

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `development` for development mode features or `production` for production mode
- `PORT`: Port number for the backend server (default: 5001)

### Frontend Environment
Create a `.env` file in the `frontend` directory with the following variables:

```
NODE_ENV=development
```

- `NODE_ENV`: Set to `development` for development mode features or `production` for production mode

## Development Mode Features

When running the application in development mode (`NODE_ENV=development`), the following features are available:

1. **User Registration**: Registration is only available in development mode. In production, registration is disabled and users must be created by an administrator.
2. **Register Button**: The register button is only visible in the navigation when in development mode.
3. **Debugging Tools**: Additional debugging information is available in the console.

## Important Notes

⚠️ **Warning**: The backend server will automatically sleep after 4 hours of inactivity. This may cause temporary delays when making requests after periods of inactivity. The server will wake up automatically when a new request is received.

## Role-Based Access

- **Admin**: Full access to manage users and tasks
- **Manager**: Can create and assign tasks to employees
- **Employee**: Can view and update their assigned tasks 