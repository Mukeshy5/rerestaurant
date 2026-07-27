const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'payment', 'promotion', 'system', 'wallet', 'support', 'delivery'], default: 'system' },
  data: { type: Object },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  image: { type: String },
  actionUrl: { type: String }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);