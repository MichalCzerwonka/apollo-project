import { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';

export const useAuthenticatedUser = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const newToken = localStorage.getItem('token');
    setIsAuthenticated(!!newToken);
    setToken(newToken);
  }, [localStorage.getItem('token')]);

  const logout = () => {
    localStorage.removeItem('token');
    redirect('/login');
  };

  return {
    isAuthenticated: isAuthenticated,
    logout,
  };
};