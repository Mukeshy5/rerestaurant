const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  type: { type: String, enum: ['hero', 'promotional', 'category', 'store'], default: 'promotional' },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);