import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useProtectedRoute = (allowedRoles = []) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, allowedRoles]);

  return { user, loading };
};

