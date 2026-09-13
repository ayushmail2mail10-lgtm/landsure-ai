import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('landsure_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('landsure_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('landsure_token', access_token);
      localStorage.setItem('landsure_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('landsure_token');
    localStorage.removeItem('landsure_user');
  };

  // 1-Click Role Switcher for SIH Presentation Demo
  const quickSwitchRole = async (targetRole) => {
    const roleEmails = {
      citizen: 'citizen@landsure.gov.in',
      officer: 'officer@landsure.gov.in',
      admin: 'admin@landsure.gov.in'
    };
    const email = roleEmails[targetRole] || roleEmails.citizen;
    return await login(email, 'Admin@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
        isCitizen: user?.role === 'citizen',
        isOfficer: user?.role === 'officer',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
