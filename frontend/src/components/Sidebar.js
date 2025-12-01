import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/students', label: 'Students' },
    { path: '/complaints', label: 'Complaints' },
    { path: '/attendance', label: 'Attendance' },
  ];

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/complaints', label: 'My Complaints' },
    { path: '/attendance', label: 'My Attendance' },
  ];

  const links = user?.role === 'admin' || user?.role === 'warden' ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-3 rounded-lg transition ${
              isActive(link.path)
                ? 'bg-hostel-orange text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

