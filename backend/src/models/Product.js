const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{ url: String, alt: String, isPrimary: { type: Boolean, default: false } }],
  price: { type: Number, required: [true, 'Price is required'] },
  comparePrice: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  tax: { type: Number, default: 0 },
  taxType: { type: String, enum: ['inclusive', 'exclusive'], default: 'inclusive' },
  unit: { type: String, default: 'piece' },
  minQuantity: { type: Number, default: 1 },
  maxQuantity: { type: Number, default: 99 },
  stock: { type: Number, default: 0 },
  lowStockAlert: { type: Number, default: 5 },
  isInStock: { type: Boolean, default: true },
  sku: { type: String, unique: true },
  barcode: { type: String },
  weight: { type: Number },
  weightUnit: { type: String, enum: ['g', 'kg', 'ml', 'l', 'piece'], default: 'piece' },
  variants: [{
    name: String,
    type: { type: String, enum: ['size', 'color', 'flavor', 'other'] },
    options: [{ value: String, price: Number, stock: Number, sku: String }]
  }],
  ingredients: [String],
  nutritionalInfo: { calories: Number, protein: Number, carbs: Number, fat: Number, fiber: Number },
  isVeg: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestRated: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSalePrice: { type: Number },
  flashSaleStart: { type: Date },
  flashSaleEnd: { type: Date },
  tags: [String],
  brand: { type: String },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  seo: { title: String, description: String, keywords: [String] },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  returnPolicy: { type: String, enum: ['no_return', '7_days', '15_days', '30_days'], default: 'no_return' },
  warranty: { type: String, default: '' }
}, { timestamps: true });

productSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') + '-' + Date.now();
  if (!this.sku) {
    this.sku = 'PRD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ store: 1, category: 1 });
productSchema.index({ price: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);