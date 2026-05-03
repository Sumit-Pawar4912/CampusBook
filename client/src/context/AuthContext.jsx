import { createContext, useContext, useEffect, useState } from 'react';
import authApi from '../services/authApi.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('campusbook_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campusbook_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('campusbook_token', token);
    } else {
      localStorage.removeItem('campusbook_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusbook_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusbook_user');
    }
  }, [user]);

  const login = async credentials => {
    setLoading(true);
    const response = await authApi.login(credentials);
    setUser(response.data.data.user);
    setToken(response.data.data.token);
    setLoading(false);
    return response;
  };

  const adminLogin = async credentials => {
    setLoading(true);
    const response = await authApi.adminLogin(credentials);
    setUser(response.data.data.user);
    setToken(response.data.data.token);
    setLoading(false);
    return response;
  };

  const register = async credentials => {
    setLoading(true);
    const response = await authApi.register(credentials);
    setUser(response.data.data.user);
    setToken(response.data.data.token);
    setLoading(false);
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusbook_user');
    localStorage.removeItem('campusbook_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
