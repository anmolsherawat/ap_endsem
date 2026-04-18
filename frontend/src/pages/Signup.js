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
    <div className="min-h-screen soft-gradient-bg flex items-center justify-center p-8">
      <div className="w-full max-w-md card-premium p-12 glow-border">
        <div className="text-center mb-12">
          <img 
            src="/logo.svg" 
            alt="HostelMate Logo" 
            className="w-20 h-10 mx-auto mb-7" 
          />
          <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Create your account
          </h2>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start managing your hostel today. Or{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              sign in to your account
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <select
              id="role"
              name="role"
              required
              className={`w-full px-6 py-4.5 text-base rounded-2xl input-premium ${darkMode ? 'text-white' : 'text-slate-900'}`}
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student" className={darkMode ? 'bg-slate-900' : 'bg-white'}>Student</option>
              <option value="admin" className={darkMode ? 'bg-slate-900' : 'bg-white'}>Admin</option>
              <option value="warden" className={darkMode ? 'bg-slate-900' : 'bg-white'}>Warden</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 btn-primary text-base font-semibold text-white rounded-2xl"
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
