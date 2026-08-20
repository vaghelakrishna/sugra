const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.dashboard = asyncHandler(async (_req, res) => {
  const [sales, orders, customers, products, lowStock, recentOrders, topProducts, recentReviews] = await Promise.all([
    Order.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments(), User.countDocuments({ role: 'customer' }), Product.find({ status: 'active', stock: { $lte: 5 } }).select('title sku stock').limit(20),
    Product.countDocuments(),
    Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(6),
    Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.product', title: { $first: '$items.title' }, image: { $first: '$items.image' }, unitsSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.lineTotal' } } }, { $sort: { unitsSold: -1 } }, { $limit: 5 }]),
    Review.find().populate('user', 'name').populate('product', 'title images').sort({ createdAt: -1 }).limit(5),
  ]);
  res.json({ data: { totalSales: sales[0]?.total || 0, totalOrders: orders, totalCustomers: customers, totalProducts: products, lowStockProducts: lowStock, recentOrders, topProducts, recentReviews } });
});

exports.listProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.stock === 'low') filter.stock = { $gt: 0, $lte: Number(req.query.threshold) || 5 };
  if (req.query.stock === 'out') filter.stock = 0;
  if (req.query.search) filter.$or = [{ title: new RegExp(req.query.search, 'i') }, { sku: new RegExp(req.query.search, 'i') }];
  const data = await Product.find(filter).populate('category', 'name').sort({ updatedAt: -1 });
  res.json({ data });
});

exports.listCategories = asyncHandler(async (_req, res) => {
  const data = await Category.aggregate([
    { $lookup: { from: 'products', localField: '_id', foreignField: 'category', as: 'products' } },
    { $addFields: { productCount: { $size: '$products' } } },
    { $project: { products: 0 } }, { $sort: { name: 1 } },
  ]);
  res.json({ data });
});

exports.listInventory = asyncHandler(async (req, res) => {
  const filter = { status: 'active' }; if (req.query.lowStock === 'true') filter.stock = { $lte: Number(req.query.threshold) || 5 };
  res.json({ data: await Product.find(filter).select('title sku stock variants status').sort({ stock: 1 }) });
});

exports.adjustStock = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity); if (!Number.isInteger(quantity)) return res.status(400).json({ message: 'quantity must be an integer adjustment' });
  const product = await Product.findByIdAndUpdate(req.params.id, { $inc: { stock: quantity } }, { new: true, runValidators: true });
  if (!product || product.stock < 0) return res.status(400).json({ message: 'Invalid product or stock adjustment' });
  res.json({ data: product });
});
