const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  authorName: { type: String, trim: true, default: 'Verified Customer' },
  authorEmail: { type: String, trim: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 120 },
  comment: { type: String, required: true, trim: true, maxlength: 2000 },
  images: [{ type: String }],
  isVerifiedPurchase: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

reviewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
