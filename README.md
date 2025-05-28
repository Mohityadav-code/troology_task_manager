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

## Role-Based Access

- **Admin**: Full access to manage users and tasks
- **Manager**: Can create and assign tasks to employees
- **Employee**: Can view and update their assigned tasks 