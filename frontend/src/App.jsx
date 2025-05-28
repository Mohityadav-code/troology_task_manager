import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getCurrentUser, selectAuth, selectIsAdmin } from './redux/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(selectAuth);
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    // Check authentication status when app loads
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route path="login" element={<Login />} />
            {process.env.NODE_ENV === 'development' && (
              <Route path="register" element={<Register />} />
            )}
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
            <Route path="tasks/new" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><TaskForm /></ProtectedRoute>} />
            <Route path="tasks/:id" element={<ProtectedRoute><TaskForm viewOnly={true} /></ProtectedRoute>} />
            <Route path="tasks/:id/edit" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
