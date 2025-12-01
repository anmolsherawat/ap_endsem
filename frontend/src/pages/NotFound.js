import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-hostel-orange">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-hostel-orange text-white px-6 py-3 rounded-lg hover:bg-hostel-orange-dark transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

