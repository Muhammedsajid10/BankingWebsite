import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const decodeToken = (token) => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.token) {
      const decodedToken = decodeToken(storedUser.token);
      return { ...storedUser, ...decodedToken };
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/login', { email, password });
    const decodedToken = decodeToken(data.data);
    setUser({ token: data.data, email: data.email, ...decodedToken });
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('http://localhost:5000/register', { name, email, password });
    const decodedToken = decodeToken(data.token);
    setUser({ token: data.token, email: data.user.email, ...decodedToken });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
