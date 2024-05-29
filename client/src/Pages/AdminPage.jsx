import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../styless/AdminPage.css';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/userRoute', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    if (user && user.isAdmin) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const disableUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/userRoute/${userId}/disable`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: false } : u));
    } catch (error) {
      console.error('Failed to disable user', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <button className="logout" onClick={logout}>Logout</button>
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>{user.name} - {user.email} - {user.isActive ? 'Active' : 'Disabled'}</span>
            {user.isActive && <button onClick={() => disableUser(user._id)}>Disable</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
