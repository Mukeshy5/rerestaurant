const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  type: { type: String, enum: ['food', 'grocery', 'fashion', 'electronics', 'furniture', 'beauty', 'medicine', 'sports', 'books', 'general'], default: 'general' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  seo: { title: String, description: String, keywords: [String] },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);