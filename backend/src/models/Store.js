const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: [true, 'Store name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  images: [String],
  phone: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['restaurant', 'grocery', 'fashion', 'electronics', 'furniture', 'beauty', 'medicine', 'sports', 'books', 'general'], default: 'general' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  address: {
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  deliveryArea: [{ type: String }],
  deliveryCharges: { type: Number, default: 0 },
  freeDeliveryAbove: { type: Number, default: 0 },
  packagingCharges: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  avgDeliveryTime: { type: String, default: '30-40 min' },
  isOpen: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  commission: { type: Number, default: 10 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  timing: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  businessDocs: {
    gst: { type: String },
    pan: { type: String },
    fssai: { type: String },
    registration: { type: String }
  },
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifsc: String,
    bankName: String,
    upiId: String
  },
  seo: { title: String, description: String, keywords: [String] },
  isFeatured: { type: Boolean, default: false },
  deliveryPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  wallet: { balance: { type: Number, default: 0 }, locked: { type: Number, default: 0 } }
}, { timestamps: true });

storeSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') + '-' + Date.now();
  next();
});

module.exports = mongoose.model('Store', storeSchema);