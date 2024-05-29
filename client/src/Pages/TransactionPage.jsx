import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import '../styless/TransactionPage.css'
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/transaction', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleMakeTransaction = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/transaction',
        { type, amount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log('Transaction created:', response.data);
      // After successful transaction, you might want to update the transactions list
      setTransactions(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Failed to make transaction:', error);
    }
  };

  return (
    <div className="transaction-page-container">
      <h1 className="transaction-page-title">Transactions</h1>
      <div className="transaction-input-group">
        <label htmlFor="transactionType" className="transaction-label">Transaction Type:</label>
        <select id="transactionType" value={type} onChange={(e) => setType(e.target.value)} className="transaction-select">
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>
      <div className="transaction-input-group">
        <label htmlFor="transactionAmount" className="transaction-label">Amount:</label>
        <input
          type="number"
          id="transactionAmount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="transaction-input"
        />
      </div>
      <button onClick={handleMakeTransaction} className="transaction-button">Make Transaction</button>
  
      <h2>Transactions List</h2>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="transaction-item">
            Type: {transaction.type}, Amount: {transaction.amount}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/dashboard')} className="transaction-button">Go to Home</button>
    </div>
  );
  
};

export default TransactionPage;
