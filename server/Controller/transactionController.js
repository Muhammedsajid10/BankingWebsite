const Transaction = require("../Models/Transaction");
const User = require("../Models/User");

const makeTransaction = async (req, res) => {
  const { type, amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'User not found or inactive' });
    }
    let balanceAfter;
    if (type === 'deposit') {
      balanceAfter = user.balance + amount;
    } else if (type === 'withdrawal') {
      if (user.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }
      balanceAfter = user.balance - amount;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    const transaction = new Transaction({ user: user.id, type, amount, balanceAfter });
    await transaction.save();
    user.balance = balanceAfter;
    user.transactions.push(transaction._id);
    await user.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { makeTransaction, getTransactions };
