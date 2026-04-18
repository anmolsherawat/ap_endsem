import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  }

  return (
    <nav className="sticky top-0 z-50 glass-premium border-b border-slate-800/30">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.svg" 
              alt="HostelMate" 
              className="w-10 h-10 rounded-xl" 
            />
            <span className="font-semibold text-2xl gradient-text">HostelMate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/rooms', label: 'Rooms' },
              ...(user && (user.role === 'admin' || user.role === 'warden') ? [{ path: '/students', label: 'Students' }] : []),
              { path: '/complaints', label: 'Complaints' },
              { path: '/attendance', label: 'Attendance' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'pill-active text-white'
                    : `${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} hover:bg-slate-800/30`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={toggleTheme}
              className={`p-3.5 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
              <div className="flex items-center gap-5">
                <span className={`text-sm font-medium hidden sm:block ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl btn-ghost ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className={`px-6 py-2.5 text-sm font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-6 py-2.5 text-sm font-semibold text-white rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
