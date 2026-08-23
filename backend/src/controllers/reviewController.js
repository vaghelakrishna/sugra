const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// 1. List Approved Reviews for a Product (Public)
exports.listProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  const count = reviews.length;
  const rating = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
  res.json({
    data: reviews,
    summary: { count, averageRating: Number(rating.toFixed(1)) }
  });
});

// 2. Create Review from Product Detail Page (Customer / User / Guest)
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment, authorName, authorEmail, images } = req.body;
  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5 || !comment) {
    return res.status(400).json({ message: 'A rating from 1 to 5 stars and a comment are required' });
  }

  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let isVerified = false;
  let userId = req.user ? req.user.id : null;
  let finalName = authorName ? authorName.trim() : (req.user ? req.user.name : 'Verified Buyer');

  if (req.user) {
    const purchased = await Order.exists({
      user: req.user.id,
      status: 'delivered',
      'items.product': product._id
    });
    if (purchased) isVerified = true;
  }

  const review = await Review.create({
    user: userId,
    authorName: finalName || 'Verified Buyer',
    authorEmail: authorEmail || (req.user ? req.user.email : undefined),
    product: product._id,
    rating: numRating,
    title: title ? title.trim() : '',
    comment: comment.trim(),
    images: Array.isArray(images) ? images.filter(Boolean) : [],
    isVerifiedPurchase: isVerified || true,
    status: 'approved', // Auto-approved so customer sees feedback instantly
  });

  res.status(201).json({ data: review, message: 'Review posted successfully!' });
});

// 3. List All Reviews for Admin Dashboard
exports.listAdminReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('product', 'title slug images price')
    .sort({ createdAt: -1 });
  res.json({ data: reviews });
});

// 4. Create Review from Admin Panel Directly
exports.createAdminReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment, authorName, authorEmail, images, status, isVerifiedPurchase } = req.body;
  const numRating = Number(rating);
  if (!productId || !numRating || numRating < 1 || numRating > 5 || !comment) {
    return res.status(400).json({ message: 'Product, valid rating (1-5), and review comment are required.' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const review = await Review.create({
    user: req.user ? req.user.id : undefined,
    authorName: authorName ? authorName.trim() : 'Customer',
    authorEmail: authorEmail ? authorEmail.trim() : undefined,
    product: product._id,
    rating: numRating,
    title: title ? title.trim() : '',
    comment: comment.trim(),
    images: Array.isArray(images) ? images.filter(Boolean) : [],
    isVerifiedPurchase: isVerifiedPurchase !== undefined ? Boolean(isVerifiedPurchase) : true,
    status: status || 'approved',
  });

  const populated = await Review.findById(review._id).populate('product', 'title slug images price');
  res.status(201).json({ data: populated, message: 'Review added successfully by Admin!' });
});

// 5. Update Review Status (Approve / Reject)
exports.updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved, rejected, or pending' });
  }
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('user', 'name email')
    .populate('product', 'title slug images price');
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ data: review });
});

// 6. Delete Review
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted successfully' });
});
