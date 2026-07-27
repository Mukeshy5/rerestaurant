const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  balance: { type: Number },
  description: { type: String, required: true },
  category: { type: String, enum: ['order_payment', 'order_refund', 'wallet_topup', 'withdrawal', 'commission', 'referral_bonus', 'reward_redeem', 'cashback', 'adjustment'], default: 'order_payment' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  reference: { type: String },
  metadata: { type: Object }
}, { timestamps: true });

transactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);