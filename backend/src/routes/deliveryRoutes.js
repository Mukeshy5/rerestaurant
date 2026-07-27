const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');

router.get('/orders', protect, authorize('delivery_partner'), async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ deliveryPartner: req.user._id }, { status: { $in: ['ready', 'out_for_delivery'] }, deliveryPartner: null }]
    }).populate('store', 'name address phone').populate('user', 'name phone address').sort({ createdAt: -1 });
    return ApiResponse.success(res, orders);
  } catch (error) { next(error); }
});

router.put('/orders/:id/accept', protect, authorize('delivery_partner'), async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryPartner: req.user._id, status: 'out_for_delivery' }, { new: true });
    return ApiResponse.success(res, order, 'Delivery accepted');
  } catch (error) { next(error); }
});

router.put('/orders/:id/deliver', protect, authorize('delivery_partner'), async (req, res, next) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);
    if (order.otp && otp !== order.otp) return ApiResponse.error(res, 'Invalid OTP', 400);
    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
    order.timeline.push({ status: 'delivered', timestamp: new Date(), updatedBy: req.user._id });
    await order.save();
    return ApiResponse.success(res, order, 'Order delivered');
  } catch (error) { next(error); }
});

router.get('/earnings', protect, authorize('delivery_partner'), async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id, status: 'delivered' });
    const totalEarnings = orders.length * 50; // Example: 50 per delivery
    const todayEarnings = orders.filter(o => new Date(o.deliveredAt).toDateString() === new Date().toDateString()).length * 50;
    return ApiResponse.success(res, { totalEarnings, todayEarnings, totalDeliveries: orders.length });
  } catch (error) { next(error); }
});

module.exports = router;