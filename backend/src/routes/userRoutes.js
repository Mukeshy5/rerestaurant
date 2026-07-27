const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return ApiResponse.success(res, users);
  } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return ApiResponse.error(res, 'User not found', 404);
    return ApiResponse.success(res, user);
  } catch (error) { next(error); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    return ApiResponse.success(res, user, 'User updated');
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, null, 'User deleted');
  } catch (error) { next(error); }
});

module.exports = router;