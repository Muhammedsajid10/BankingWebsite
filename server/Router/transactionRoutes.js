const express = require('express');
const { authenticateToken } = require('../Middleware/authMiddleware');
const { makeTransaction, getTransactions } = require('../Controller/transactionController');
const tranRouter = express.Router();

tranRouter.route('/').post(authenticateToken, makeTransaction).get(authenticateToken, getTransactions);

module.exports = tranRouter;
