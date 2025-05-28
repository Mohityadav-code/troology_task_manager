import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="page-container">
        <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white shadow-inner py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 