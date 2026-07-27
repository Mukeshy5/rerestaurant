const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');

router.get('/', async (req, res, next) => {
  try {
    const { type, parent } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (parent) query.parent = parent;
    else query.parent = null;
    const categories = await Category.find(query).populate('subcategories').sort({ order: 1 });
    return ApiResponse.success(res, categories);
  } catch (error) { next(error); }
});

router.get('/all', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).populate('subcategories').sort({ order: 1 });
    return ApiResponse.success(res, categories);
  } catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('subcategories');
    if (!category) return ApiResponse.error(res, 'Category not found', 404);
    return ApiResponse.success(res, category);
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return ApiResponse.created(res, category, 'Category created');
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return ApiResponse.success(res, category, 'Category updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'Category deleted');
  } catch (error) { next(error); }
});

module.exports = router;