import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  return (
    <footer style={{ backgroundColor: darkMode ? '#1f2937' : '#f3f4f6', color: darkMode ? '#d1d5db' : '#333', padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          <div>
            <img src="/logo.svg" alt="HostelMate" style={{ width: '100px', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#fff' : '#333' }}>HostelMate</h3>
            <p style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', lineHeight: '1.6' }}>
              Streamline your hostel operations with our comprehensive management system. 
              Manage rooms, students, complaints, and attendance all in one place.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#fff' : '#333' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/" style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/dashboard" style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link to="/rooms" style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none' }}>Rooms</Link></li>
              <li><Link to="/complaints" style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none' }}>Complaints</Link></li>
              <li><Link to="/attendance" style={{ fontSize: '14px', color: darkMode ? '#d1d5db' : '#333', textDecoration: 'none' }}>Attendance</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#fff' : '#333' }}>Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
              <li>Email: hostelmateZERO7@gmail.com</li>
              <li>Phone: +91 9992537123</li>
              <li>Address: Lohegaon, Pune</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid ' + (darkMode ? '#374151' : '#d1d5db') }}>
          <p style={{ textAlign: 'center', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
            © 2025 Zero 7 Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
