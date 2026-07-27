const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (req.user.role === 'customer') query.user = req.user._id;
    if (req.user.role === 'store_owner') {
      const Store = require('../models/Store');
      const store = await Store.findOne({ owner: req.user._id });
      if (store) query.store = store._id;
    }
    if (req.user.role === 'delivery_partner') query.deliveryPartner = req.user._id;
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .populate('store', 'name logo')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return ApiResponse.paginated(res, orders, total, Number(page), Number(limit));
  } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name phone email')
      .populate('store', 'name logo phone email address')
      .populate('deliveryPartner', 'name phone')
      .populate('items.product', 'name images price');
    if (!order) return ApiResponse.error(res, 'Order not found', 404);
    return ApiResponse.success(res, order);
  } catch (error) { next(error); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user._id });
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [], total: 0, itemCount: 0 } });
    return ApiResponse.created(res, order, 'Order placed successfully');
  } catch (error) { next(error); }
});

router.put('/:id/status', protect, authorize('store_owner', 'admin', 'delivery_partner'), async (req, res, next) => {
  try {
    const { status, note, otp } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return ApiResponse.error(res, 'Order not found', 404);

    if (status === 'delivered' && order.otp && otp !== order.otp) {
      return ApiResponse.error(res, 'Invalid delivery OTP', 400);
    }

    order.status = status;
    order.timeline.push({ status, note, updatedBy: req.user._id, timestamp: new Date() });
    if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'paid'; }
    if (status === 'cancelled') { order.cancelledAt = new Date(); order.cancelReason = note; }
    await order.save();

    return ApiResponse.success(res, order, `Order ${status}`);
  } catch (error) { next(error); }
});

router.put('/:id/assign', protect, authorize('store_owner', 'admin'), async (req, res, next) => {
  try {
    const { deliveryPartner } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { deliveryPartner }, { new: true });
    return ApiResponse.success(res, order, 'Delivery partner assigned');
  } catch (error) { next(error); }
});

module.exports = router;