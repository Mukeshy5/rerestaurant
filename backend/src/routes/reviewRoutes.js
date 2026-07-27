const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Store = require('../models/Store');
const ApiResponse = require('../utils/apiResponse');

router.get('/product/:productId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Review.countDocuments({ product: req.params.productId });
    return ApiResponse.paginated(res, reviews, total, Number(page), Number(limit));
  } catch (error) { next(error); }
});

router.get('/store/:storeId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ store: req.params.storeId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 }).limit(20);
    return ApiResponse.success(res, reviews);
  } catch (error) { next(error); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id });
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(review.product, { rating: Math.round(avgRating * 10) / 10, totalRatings: reviews.length });
    return ApiResponse.created(res, review, 'Review added');
  } catch (error) { next(error); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return ApiResponse.success(res, review, 'Review updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Review deleted');
  } catch (error) { next(error); }
});

module.exports = router;