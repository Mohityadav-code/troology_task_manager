import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector(selectAuth);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided and not empty, check if user role is included
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  // User is authenticated and has permission
  return children;
};

export default ProtectedRoute; 