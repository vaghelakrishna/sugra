const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');

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
  res.json({ data: await Product.find(filter).select('title sku stock price compareAtPrice variants inventoryByLocation status images category').populate('category', 'name').sort({ stock: 1 }) });
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

// Bulk Import Products (via CSV / JSON array)
exports.bulkImportProducts = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No product rows provided in items array.' });
  }

  let createdCount = 0;
  let updatedCount = 0;
  const errors = [];

  const categories = await Category.find();
  const categoryMap = new Map();
  categories.forEach(c => {
    categoryMap.set(c.name.toLowerCase(), c._id);
    categoryMap.set(c.slug.toLowerCase(), c._id);
  });

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      const title = (item.title || '').trim();
      const sku = (item.sku || '').trim();
      if (!title) {
        errors.push(`Row ${i + 1}: Title is required`);
        continue;
      }

      const price = Number(item.price) || 0;
      const compareAtPrice = item.compareAtPrice ? Number(item.compareAtPrice) : undefined;
      const stock = Number(item.stock) >= 0 ? Number(item.stock) : 0;
      const description = (item.description || '').trim();
      const material = (item.material || '').trim();
      
      let categoryId = undefined;
      if (item.category) {
        const catName = String(item.category).trim().toLowerCase();
        if (categoryMap.has(catName)) {
          categoryId = categoryMap.get(catName);
        } else {
          // create category if not exists
          const newCat = await Category.create({ name: item.category.trim(), slug: slugify(item.category) });
          categoryMap.set(newCat.name.toLowerCase(), newCat._id);
          categoryMap.set(newCat.slug.toLowerCase(), newCat._id);
          categoryId = newCat._id;
        }
      }

      const images = Array.isArray(item.images)
        ? item.images
        : typeof item.images === 'string'
        ? item.images.split(/[,|;]/).map(s => s.trim()).filter(Boolean)
        : [];

      // Find existing by SKU or Title
      let existing = null;
      if (sku) existing = await Product.findOne({ sku });
      if (!existing && title) existing = await Product.findOne({ title });

      if (existing) {
        existing.price = price || existing.price;
        if (compareAtPrice !== undefined) existing.compareAtPrice = compareAtPrice;
        if (stock !== undefined) existing.stock = stock;
        if (description) existing.description = description;
        if (material) existing.material = material;
        if (categoryId) existing.category = categoryId;
        if (images.length) existing.images = images;
        if (item.status) existing.status = item.status;
        await existing.save();
        updatedCount++;
      } else {
        const baseSlug = slugify(title);
        let slug = baseSlug;
        let counter = 1;
        while (await Product.exists({ slug })) {
          slug = `${baseSlug}-${counter++}`;
        }
        await Product.create({
          title,
          slug,
          sku: sku || `SUG-${Date.now()}-${i}`,
          price,
          compareAtPrice,
          stock,
          description,
          material: material || '18K Gold Plated Stainless Steel',
          category: categoryId,
          images: images.length ? images : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'],
          status: item.status || 'active'
        });
        createdCount++;
      }
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err.message}`);
    }
  }

  res.json({
    message: `Processed ${items.length} rows: ${createdCount} created, ${updatedCount} updated.`,
    createdCount,
    updatedCount,
    errors
  });
});

// Bulk Import Inventory Stock & Price Updates (via CSV / JSON array)
exports.bulkImportInventory = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No inventory rows provided in items array.' });
  }

  let updatedCount = 0;
  const notFound = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sku = (item.sku || '').trim();
    const title = (item.title || '').trim();
    const stock = item.stock !== undefined && item.stock !== '' ? Number(item.stock) : null;
    const price = item.price !== undefined && item.price !== '' ? Number(item.price) : null;

    let product = null;
    if (sku) product = await Product.findOne({ sku });
    if (!product && title) product = await Product.findOne({ title: new RegExp(`^${title}$`, 'i') });

    if (product) {
      if (stock !== null && !isNaN(stock) && stock >= 0) product.stock = stock;
      if (price !== null && !isNaN(price) && price > 0) product.price = price;
      if (item.compareAtPrice !== undefined && item.compareAtPrice !== '') {
        product.compareAtPrice = Number(item.compareAtPrice) || undefined;
      }
      await product.save();
      updatedCount++;
    } else {
      notFound.push(sku || title || `Row ${i + 1}`);
    }
  }

  res.json({
    message: `Updated inventory for ${updatedCount} products.`,
    updatedCount,
    notFound
  });
});
