const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['order', 'payment', 'delivery', 'product', 'account', 'technical', 'other'], default: 'other' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  attachments: [String],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    attachments: [String],
    isStaff: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);