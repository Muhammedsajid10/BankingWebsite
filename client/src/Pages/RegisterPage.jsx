import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../styless/RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div className="register-page-container">
      <form onSubmit={handleSubmit}>
        <h2 className="register-page-title">Register</h2>
        <label className="register-page-label">Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="register-page-input input-box" />
        <label className="register-page-label">Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-page-input input-box" />
        <label className="register-page-label">Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="register-page-input input-box" />
        <button type="submit" className="register-page-button button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
