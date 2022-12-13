import { useEffect, useState } from 'react';
//import { redirect } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export const useAuthenticatedUser = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  let navigate = useNavigate();

  useEffect(() => {
    const newToken = localStorage.getItem('token');
    setIsAuthenticated(!!newToken);
    setToken(newToken);
  }, [localStorage.getItem('token')]);

  const logout = () => {
    console.log('logout');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return {
    isAuthenticated: isAuthenticated,
    logout,
  };
};