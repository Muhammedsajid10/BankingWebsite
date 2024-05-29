import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../styless/LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(email.includes('admin')? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleSubmit}>
        <h2 className="login-page-title">Login</h2>
        <label className="login-page-label">Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-page-input input-box" />
        <label className="login-page-label">Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-page-input input-box" />
        <button type="submit" className="login-page-button button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
