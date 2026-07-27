const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    return ApiResponse.success(res, { notifications, unreadCount });
  } catch (error) { next(error); }
});

router.put('/:id/read', protect, async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
    return ApiResponse.success(res, null, 'Marked as read');
  } catch (error) { next(error); }
});

router.put('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
    return ApiResponse.success(res, null, 'All marked as read');
  } catch (error) { next(error); }
});

module.exports = router;