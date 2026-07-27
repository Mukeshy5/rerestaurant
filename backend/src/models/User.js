const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  phone: { type: String, required: [true, 'Phone is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'store_owner', 'delivery_partner', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  refreshToken: { type: String },
  address: [{
    label: { type: String, default: 'Home' },
    fullAddress: { type: String, required: true },
    apartment: String,
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isDefault: { type: Boolean, default: false }
  }],
  wallet: { balance: { type: Number, default: 0 }, locked: { type: Number, default: 0 } },
  rewardPoints: { type: Number, default: 0 },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  favoriteStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  favoriteRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  savedCards: [{
    cardNumber: { type: String },
    cardHolder: { type: String },
    expiryDate: { type: String },
    cardType: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  recentlyViewed: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, viewedAt: { type: Date, default: Date.now } }],
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  membership: { type: String, enum: ['none', 'silver', 'gold', 'platinum'], default: 'none' },
  fcmToken: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  lastLogin: { type: Date },
  isOnline: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateReferralCode = function () {
  return 'WLF' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = mongoose.model('User', userSchema);