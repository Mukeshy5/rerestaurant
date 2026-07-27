const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true, endDate: { $gte: new Date() } });
    return ApiResponse.success(res, coupons);
  } catch (error) { next(error); }
});

router.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, endDate: { $gte: new Date() } });
    if (!coupon) return ApiResponse.error(res, 'Invalid coupon code', 400);
    if (coupon.usedCount >= coupon.usageLimit) return ApiResponse.error(res, 'Coupon usage limit reached', 400);
    if (orderTotal < coupon.minOrderAmount) return ApiResponse.error(res, `Minimum order amount of ${coupon.minOrderAmount} required`, 400);
    
    let discount = coupon.type === 'percentage' ? (orderTotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    
    return ApiResponse.success(res, { coupon, discount }, 'Coupon applied');
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    return ApiResponse.created(res, coupon, 'Coupon created');
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return ApiResponse.success(res, coupon, 'Coupon updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Coupon deleted');
  } catch (error) { next(error); }
});

module.exports = router;