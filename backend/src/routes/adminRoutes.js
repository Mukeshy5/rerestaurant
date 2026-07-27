const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiResponse = require('../utils/apiResponse');

router.use(protect, authorize('admin'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenue = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
    const recentOrders = await Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(10);
    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    return ApiResponse.success(res, { totalUsers, totalStores, totalProducts, totalOrders, revenue: revenue[0]?.total || 0, recentOrders, ordersByStatus });
  } catch (error) { next(error); }
});

router.get('/analytics', async (req, res, next) => {
  try {
    const dailySales = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, paymentStatus: 'paid' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    return ApiResponse.success(res, { dailySales });
  } catch (error) { next(error); }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return ApiResponse.success(res, users);
  } catch (error) { next(error); }
});

router.put('/users/:id/status', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select('-password');
    return ApiResponse.success(res, user, 'User status updated');
  } catch (error) { next(error); }
});

router.get('/stores', async (req, res, next) => {
  try {
    const stores = await Store.find().populate('owner', 'name email phone').sort({ createdAt: -1 });
    return ApiResponse.success(res, stores);
  } catch (error) { next(error); }
});

router.put('/stores/:id/verify', async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified }, { new: true });
    return ApiResponse.success(res, store, 'Store verification updated');
  } catch (error) { next(error); }
});

module.exports = router;