const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id }).populate('transactions');
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });
    return ApiResponse.success(res, wallet);
  } catch (error) { next(error); }
});

router.get('/transactions', protect, async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    return ApiResponse.success(res, transactions);
  } catch (error) { next(error); }
});

router.post('/add', protect, async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });
    
    wallet.balance += amount;
    wallet.totalCredited += amount;
    const transaction = await Transaction.create({ user: req.user._id, wallet: wallet._id, type: 'credit', amount, balance: wallet.balance, description, category: 'wallet_topup' });
    wallet.transactions.push(transaction._id);
    await wallet.save();
    
    return ApiResponse.success(res, { wallet, transaction }, 'Amount added to wallet');
  } catch (error) { next(error); }
});

module.exports = router;