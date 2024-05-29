const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers, disableUser } = require('../Controller/userController');
const { authenticateToken, admin } = require('../Middleware/authMiddleware'); // Corrected import
const userRouter = express.Router();

userRouter.route('/profile')
  .get(authenticateToken, getUserProfile)
  .put(authenticateToken, updateUserProfile);

userRouter.route('/')
  .get(authenticateToken, admin, getAllUsers); // Route for getting all users

userRouter.route('/:id/disable')
  .put(authenticateToken, admin, disableUser); // Route for disabling a user

module.exports = userRouter;

