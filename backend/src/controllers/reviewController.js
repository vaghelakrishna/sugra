const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

exports.listProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
    .populate('user', 'name').sort({ createdAt: -1 });
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  res.json({ data: reviews, summary: { count: reviews.length, averageRating: Number(rating.toFixed(1)) } });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) return res.status(400).json({ message: 'A rating from 1 to 5 and comment are required' });
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const purchased = await Order.exists({ user: req.user.id, status: 'delivered', 'items.product': product._id });
  if (!purchased) return res.status(403).json({ message: 'Only customers with a delivered order can review this product' });
  const review = await Review.create({ user: req.user.id, product: product._id, rating, title, comment });
  res.status(201).json({ data: review });
});

exports.listAdminReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().populate('user', 'name email').populate('product', 'title slug').sort({ createdAt: -1 });
  res.json({ data: reviews });
});

exports.updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected' });
  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ data: review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted successfully' });
});

