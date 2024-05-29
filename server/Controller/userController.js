const argon2 = require('argon2');
const User = require('../Models/User');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Disable a user (admin only)
const disableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = false;
    await user.save();
    res.json({ message: 'User disabled' });
  } catch (error) {
    console.error('Error in disableUser:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('transactions');
    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = await argon2.hash(password);
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, disableUser };
