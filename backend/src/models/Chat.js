const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  image: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  type: { type: String, enum: ['text', 'image', 'order_update', 'delivery_update'], default: 'text' }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  unreadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
module.exports.Message = mongoose.model('Message', messageSchema);