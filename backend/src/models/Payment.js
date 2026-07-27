const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  paymentId: { type: String, unique: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  stripePaymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  method: { type: String, enum: ['cod', 'card', 'upi', 'netbanking', 'wallet', 'razorpay', 'stripe'], default: 'cod' },
  type: { type: String, enum: ['order', 'wallet_topup', 'withdrawal', 'refund'], default: 'order' },
  refundId: { type: String },
  refundAmount: { type: Number },
  refundReason: { type: String },
  metadata: { type: Object },
  paidAt: { type: Date },
  refundedAt: { type: Date }
}, { timestamps: true });

paymentSchema.pre('save', function (next) {
  if (!this.paymentId) {
    this.paymentId = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);