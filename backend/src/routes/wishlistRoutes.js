const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    return ApiResponse.success(res, user.wishlist);
  } catch (error) { next(error); }
});

router.post('/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(req.params.productId)) {
      user.wishlist.pull(req.params.productId);
    } else {
      user.wishlist.push(req.params.productId);
    }
    await user.save();
    return ApiResponse.success(res, user.wishlist, 'Wishlist updated');
  } catch (error) { next(error); }
});

router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } }, { new: true });
    return ApiResponse.success(res, user.wishlist, 'Removed from wishlist');
  } catch (error) { next(error); }
});

module.exports = router;