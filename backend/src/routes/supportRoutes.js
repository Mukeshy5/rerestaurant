const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');
const ApiResponse = require('../utils/apiResponse');

router.get('/', protect, async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const tickets = await SupportTicket.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    return ApiResponse.success(res, tickets);
  } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id).populate('user', 'name email').populate('messages.sender', 'name avatar');
    if (!ticket) return ApiResponse.error(res, 'Ticket not found', 404);
    return ApiResponse.success(res, ticket);
  } catch (error) { next(error); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const ticket = await SupportTicket.create({ ...req.body, user: req.user._id });
    return ApiResponse.created(res, ticket, 'Ticket created');
  } catch (error) { next(error); }
});

router.post('/:id/message', protect, async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return ApiResponse.error(res, 'Ticket not found', 404);
    ticket.messages.push({ sender: req.user._id, message: req.body.message, isStaff: req.user.role === 'admin' });
    ticket.status = 'in_progress';
    await ticket.save();
    return ApiResponse.success(res, ticket, 'Message added');
  } catch (error) { next(error); }
});

router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status, resolvedAt: req.body.status === 'resolved' ? new Date() : undefined }, { new: true });
    return ApiResponse.success(res, ticket, 'Ticket status updated');
  } catch (error) { next(error); }
});

module.exports = router;