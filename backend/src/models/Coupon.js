const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  usersUsed: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, count: { type: Number, default: 1 } }],
  applicableStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  minItems: { type: Number, default: 0 },
  isFirstOrderOnly: { type: Boolean, default: false },
  isNewUserOnly: { type: Boolean, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);