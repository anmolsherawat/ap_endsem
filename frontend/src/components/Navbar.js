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
    <nav style={{ backgroundColor: darkMode ? '#1f2937' : '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="HostelMate Logo" style={{ width: '60px', height: '60px', borderRadius: '8px' }} />
            <div style={{ color: darkMode ? '#fff' : '#333', fontWeight: 'bold', fontSize: '20px' }}>HostelMate</div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
              HOME
            </Link>
            <Link to="/dashboard" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/dashboard') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
              DASHBOARD
            </Link>
            <Link to="/rooms" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/rooms') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
              ROOMS
            </Link>
            {user && (user.role === 'admin' || user.role === 'warden') && (
              <Link to="/students" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/students') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
                STUDENTS
              </Link>
            )}
            <Link to="/complaints" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/complaints') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
              COMPLAINTS
            </Link>
            <Link to="/attendance" style={{ padding: '8px 12px', fontSize: '14px', fontWeight: '500', color: isActive('/attendance') ? '#FF6B35' : (darkMode ? '#d1d5db' : '#333'), textDecoration: 'none' }}>
              ATTENDANCE
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleTheme} style={{ padding: '8px', borderRadius: '8px', backgroundColor: darkMode ? '#374151' : '#e5e7eb', border: 'none', cursor: 'pointer', fontSize: '18px', color: darkMode ? '#fff' : '#333' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                <span style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333' }}>Welcome, {user.name}</span>
                <button onClick={handleLogout} style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none', fontSize: '14px' }}>
                  Login
                </Link>
                <Link to="/signup" style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
