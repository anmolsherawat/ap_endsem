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
    <div className="min-h-screen soft-gradient-bg flex items-center justify-center p-8">
      <div className="w-full max-w-md card-premium p-12 glow-border">
        <div className="text-center mb-12">
          <img 
            src="/logo.svg" 
            alt="HostelMate Logo" 
            className="w-20 h-10 mx-auto mb-7" 
          />
          <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Welcome back
          </h2>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in to your account. Or{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 btn-primary text-base font-semibold text-white rounded-2xl"
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
