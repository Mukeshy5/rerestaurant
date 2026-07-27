const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Product = require('../models/Product');
const ApiResponse = require('../utils/apiResponse');

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, store, search, sort, minPrice, maxPrice, rating, veg } = req.query;
    const query = { isActive: true, isApproved: true };
    
    if (category) query.category = category;
    if (store) query.store = store;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (rating) query.rating = { $gte: Number(rating) };
    if (veg !== undefined) query.isVeg = veg === 'true';

    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popular') sortOption.totalSold = -1;
    else sortOption.createdAt = -1;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('store', 'name logo')
      .populate('category', 'name')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return ApiResponse.paginated(res, products, total, Number(page), Number(limit));
  } catch (error) { next(error); }
});

router.get('/featured', async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('store', 'name logo')
      .limit(20);
    return ApiResponse.success(res, products);
  } catch (error) { next(error); }
});

router.get('/trending', async (req, res, next) => {
  try {
    const products = await Product.find({ isTrending: true, isActive: true })
      .populate('store', 'name logo')
      .sort({ totalSold: -1 })
      .limit(20);
    return ApiResponse.success(res, products);
  } catch (error) { next(error); }
});

router.get('/flash-sale', async (req, res, next) => {
  try {
    const products = await Product.find({
      isFlashSale: true,
      isActive: true,
      flashSaleEnd: { $gte: new Date() }
    }).populate('store', 'name logo').limit(20);
    return ApiResponse.success(res, products);
  } catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('store', 'name logo rating')
      .populate('category', 'name slug');
    if (!product) return ApiResponse.error(res, 'Product not found', 404);
    return ApiResponse.success(res, product);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('store', 'name logo rating')
      .populate('category', 'name slug');
    if (!product) return ApiResponse.error(res, 'Product not found', 404);
    return ApiResponse.success(res, product);
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('store_owner', 'admin'), upload.array('images', 10), async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => ({ url: `/uploads/${f.filename}`, alt: req.body.name })) : [];
    const productData = { ...req.body, images };
    if (!productData.store && req.user.role === 'store_owner') {
      const Store = require('../models/Store');
      const store = await Store.findOne({ owner: req.user._id });
      if (store) productData.store = store._id;
    }
    const product = await Product.create(productData);
    return ApiResponse.created(res, product, 'Product created');
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('store_owner', 'admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return ApiResponse.error(res, 'Product not found', 404);
    return ApiResponse.success(res, product, 'Product updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('store_owner', 'admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return ApiResponse.error(res, 'Product not found', 404);
    return ApiResponse.success(res, null, 'Product deleted');
  } catch (error) { next(error); }
});

module.exports = router;