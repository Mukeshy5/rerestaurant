const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Banner = require('../models/Banner');
const ApiResponse = require('../utils/apiResponse');

router.get('/', async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true, $or: [{ endDate: { $gte: new Date() } }, { endDate: null }] }).sort({ position: 1 });
    return ApiResponse.success(res, banners);
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    return ApiResponse.created(res, banner, 'Banner created');
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return ApiResponse.success(res, banner, 'Banner updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Banner deleted');
  } catch (error) { next(error); }
});

module.exports = router;