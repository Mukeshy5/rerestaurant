const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const Store = require('../models/Store');
const ApiResponse = require('../utils/apiResponse');

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, city, search, isOpen } = req.query;
    const query = { isActive: true, isVerified: true };
    if (type) query.type = type;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (isOpen !== undefined) query.isOpen = isOpen === 'true';

    const total = await Store.countDocuments(query);
    const stores = await Store.find(query)
      .populate('owner', 'name email phone')
      .sort({ rating: -1, totalOrders: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return ApiResponse.paginated(res, stores, total, Number(page), Number(limit));
  } catch (error) { next(error); }
});

router.get('/featured', async (req, res, next) => {
  try {
    const stores = await Store.find({ isFeatured: true, isActive: true }).limit(20);
    return ApiResponse.success(res, stores);
  } catch (error) { next(error); }
});

router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;
    if (!lat || !lng) return ApiResponse.error(res, 'Latitude and longitude required', 400);
    const stores = await Store.find({
      isActive: true,
      'address.lat': { $exists: true },
      'address.lng': { $exists: true }
    }).limit(20);
    return ApiResponse.success(res, stores);
  } catch (error) { next(error); }
});

router.get('/my-store', protect, authorize('store_owner'), async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id }).populate('categories');
    if (!store) return ApiResponse.error(res, 'Store not found', 404);
    return ApiResponse.success(res, store);
  } catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug }).populate('owner', 'name email');
    if (!store) return ApiResponse.error(res, 'Store not found', 404);
    return ApiResponse.success(res, store);
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('store_owner', 'admin'), async (req, res, next) => {
  try {
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore && req.user.role === 'store_owner') {
      return ApiResponse.error(res, 'You already have a store', 400);
    }
    const store = await Store.create({ ...req.body, owner: req.user._id });
    return ApiResponse.created(res, store, 'Store created');
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('store_owner', 'admin'), async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!store) return ApiResponse.error(res, 'Store not found', 404);
    return ApiResponse.success(res, store, 'Store updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await Store.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Store deleted');
  } catch (error) { next(error); }
});

module.exports = router;