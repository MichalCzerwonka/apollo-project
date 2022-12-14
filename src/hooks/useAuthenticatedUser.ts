import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logoutAccount } from '../api/ApiAccount';

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
    console.log('Logging out');
    const token = localStorage.getItem('token');
    if(token){
      logoutAccount();
    }
    localStorage.clear();
    navigate('/login');
  };

  return {
    isAuthenticated: isAuthenticated,
    logout,
  };


};
