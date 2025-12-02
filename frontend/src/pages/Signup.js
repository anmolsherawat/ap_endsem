import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const result = await signup(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#111827' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '448px', width: '100%', backgroundColor: darkMode ? '#1f2937' : 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.svg" alt="HostelMate Logo" style={{ width: '120px', margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ marginTop: '24px', textAlign: 'center', fontSize: '30px', fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
            Create your account
          </h2>
          <p style={{ marginTop: '8px', textAlign: 'center', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
            Or{' '}
            <Link to="/login" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: '500' }}>
              sign in to existing account
            </Link>
          </p>
        </div>
        <form style={{ marginTop: '32px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#333' }}>Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#333' }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#333' }}>Phone (Optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#333' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#333' }}>Role</label>
              <select
                id="role"
                name="role"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="warden">Warden</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px 16px', backgroundColor: '#FF6B35', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
