const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Payment = require('../models/Payment');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, payments);
  } catch (error) { next(error); }
});

router.post('/create-order', protect, async (req, res, next) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const payment = await Payment.create({ user: req.user._id, amount, currency, method: 'razorpay' });
    return ApiResponse.created(res, payment, 'Payment order created');
  } catch (error) { next(error); }
});

router.post('/verify', protect, async (req, res, next) => {
  try {
    const { paymentId, razorpayPaymentId, razorpaySignature } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: 'success', razorpayPaymentId, razorpaySignature, paidAt: new Date() },
      { new: true }
    );
    return ApiResponse.success(res, payment, 'Payment verified');
  } catch (error) { next(error); }
});

module.exports = router;