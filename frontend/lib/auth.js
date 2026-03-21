'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = null;

    if (typeof window !== 'undefined') {
      const Cookies = require('js-cookie');

      const stored = localStorage.getItem('user');
      token = Cookies.get('token') || localStorage.getItem('token');

      if (stored && token) {
        setUser(JSON.parse(stored));
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);

    if (typeof window !== 'undefined') {
      const Cookies = require('js-cookie');

      Cookies.set('token', token, { expires: 7 });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);

    if (typeof window !== 'undefined') {
      const Cookies = require('js-cookie');

      Cookies.remove('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);

    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
