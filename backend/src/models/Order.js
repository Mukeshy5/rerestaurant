const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variant: { name: String, value: String },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  status: { type: String, enum: ['pending', 'accepted', 'preparing', 'packed', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'returned'], default: 'pending' },
  isVeg: Boolean,
  subtotal: Number,
  tax: Number,
  total: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'accepted', 'preparing', 'packed', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'returned', 'rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'card', 'upi', 'netbanking', 'wallet', 'razorpay', 'stripe'], default: 'cod' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  deliveryAddress: {
    label: String,
    fullAddress: { type: String, required: true },
    apartment: String,
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: Number,
    lng: Number
  },
  subtotal: { type: Number, required: true },
  deliveryCharges: { type: Number, default: 0 },
  packagingCharges: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  walletUsed: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  instructions: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
  returnReason: { type: String },
  returnRequested: { type: Boolean, default: false },
  returnApproved: { type: Boolean, default: false },
  refundAmount: { type: Number, default: 0 },
  refundStatus: { type: String, enum: ['none', 'pending', 'processed', 'failed'], default: 'none' },
  otp: { type: String },
  isRated: { type: Boolean, default: false },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  invoiceUrl: { type: String },
  isScheduled: { type: Boolean, default: false },
  scheduledTime: { type: Date },
  orderType: { type: String, enum: ['instant', 'scheduled'], default: 'instant' }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);