import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
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
            Sign in to your account
          </h2>
          <p style={{ marginTop: '8px', textAlign: 'center', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
            Or{' '}
            <Link to="/signup" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: '500' }}>
              create a new account
            </Link>
          </p>
        </div>
        <form style={{ marginTop: '32px' }} onSubmit={handleSubmit}>
          <div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={{ marginTop: '8px' }}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px 16px', backgroundColor: '#FF6B35', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
