import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated, selectIsAdmin, selectIsManager } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Function to check if current screen is mobile
  const isMobile = () => {
    return windowWidth < 768; // 768px is the md breakpoint in Tailwind
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu when switching to desktop
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  // Determine active path
  const isActive = (path) => {
    return location.pathname === path ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500';
  };

  // Desktop Navigation Component
  const DesktopNavigation = () => (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">TaskManager</Link>
            </div>
            {isAuthenticated && (
              <div className="flex ml-6 space-x-8">
                <Link to="/dashboard" className={`${isActive('/dashboard')} hover:border-blue-500 hover:text-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Dashboard
                </Link>
                <Link to="/tasks" className={`${isActive('/tasks')} hover:border-blue-500 hover:text-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Tasks
                </Link>
                {isAdmin && (
                  <Link to="/users" className={`${isActive('/users')} hover:border-blue-500 hover:text-blue-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Users
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex ml-6 items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center">
                <Link to="/profile" className="text-sm font-medium text-gray-700 mr-4 hover:text-blue-500">
                  {user?.name} ({user?.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                {process.env.NODE_ENV === 'development' && (
                  <Link to="/register" className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-md text-sm font-medium">
                    Register (Dev)
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">TaskManager</Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/dashboard') ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-gray-600'} hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tasks" 
                  className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/tasks') ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-gray-600'} hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tasks
                </Link>
                {isAdmin && (
                  <Link 
                    to="/users" 
                    className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/users') ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-gray-600'} hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Users
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/profile') ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-gray-600'} hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                    <span className="text-sm font-medium leading-none text-blue-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex justify-around px-4">
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                {process.env.NODE_ENV === 'development' && (
                  <Link 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Register (Dev)
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Render based on screen size
  return isMobile() ? <MobileNavigation /> : <DesktopNavigation />;
};

export default Navbar;