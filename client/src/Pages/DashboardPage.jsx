import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import '../styless/DashboardPage.css'; 
import { useNavigate } from 'react-router-dom'; 
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:5000/userRoute/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBalance(data.balance);
      setTransactions(data.transactions);
    };
    fetchData();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <h2 className="dashboard-balance">Balance: $<span className="dashboard-balance">{balance}</span></h2>
      <button onClick={logout} className="dashboard-button">Logout</button>
      
      <h3 className="dashboard-title">Transactions</h3>
      <ul className="dashboard-transactions">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="dashboard-transaction-item">
            <strong className="dashboard-transaction-type">{transaction.type}:</strong> ₹{transaction.amount} (Balance after: ₹{transaction.balanceAfter})
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/transactions')} className="dashboard-button">Make Transaction</button>
    </div>
  );
};

export default DashboardPage;
