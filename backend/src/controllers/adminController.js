const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.dashboard = asyncHandler(async (_req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [sales, orders, customers, lowStock, products, recentOrders, topProducts, recentReviews, monthlySales] = await Promise.all([
    Order.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.find({ status: 'active', stock: { $lte: 5 } }).select('title sku stock images').limit(20),
    Product.countDocuments(),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(6),
    Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.product', title: { $first: '$items.title' }, image: { $first: '$items.image' }, unitsSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.lineTotal' } } }, { $sort: { unitsSold: -1 } }, { $limit: 5 }]),
    Review.find().populate('user', 'name').populate('product', 'title images').sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { 'payment.status': 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b', date: '$createdAt' } },
          monthIndex: { $first: { $month: '$createdAt' } },
          year: { $first: { $year: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { year: 1, monthIndex: 1 } }
    ])
  ]);
  res.json({
    data: {
      totalSales: sales[0]?.total || 0,
      totalOrders: orders,
      totalCustomers: customers,
      totalProducts: products,
      lowStockProducts: lowStock,
      recentOrders,
      topProducts,
      recentReviews,
      monthlySales
    }
  });
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
  res.json({ data: await Product.find(filter).select('title sku stock variants inventoryByLocation status').sort({ stock: 1 }) });
});

exports.adjustStock = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity); if (!Number.isInteger(quantity)) return res.status(400).json({ message: 'quantity must be an integer adjustment' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (req.body.variantId) {
    const variant = product.variants.id(req.body.variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    if (variant.stock + quantity < 0) return res.status(400).json({ message: 'Variant stock cannot be negative' });
    variant.stock += quantity;
    product.stock = product.variants.reduce((total, item) => total + item.stock, 0);
  } else if (req.body.locationName) {
    let location = product.inventoryByLocation.find(item => item.name === req.body.locationName);
    if (!location) {
      if (quantity < 0) return res.status(400).json({ message: 'Location stock cannot be negative' });
      product.inventoryByLocation.push({ name: String(req.body.locationName).trim(), quantity });
    } else {
      if (location.quantity + quantity < 0) return res.status(400).json({ message: 'Location stock cannot be negative' });
      location.quantity += quantity;
    }
    product.stock = product.inventoryByLocation.reduce((total, item) => total + item.quantity, 0);
  } else {
    if (product.stock + quantity < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
    product.stock += quantity;
  }
  await product.save();
  res.json({ data: product });
});
