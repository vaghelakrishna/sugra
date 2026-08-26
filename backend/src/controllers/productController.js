const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');

exports.listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 100);
  const filter = { status: 'active' };
  if (req.query.category) {
    const categoryValue = String(req.query.category);
    if (mongoose.isObjectIdOrHexString(categoryValue)) filter.category = categoryValue;
    else {
      const category = await Category.findOne({ slug: categoryValue.toLowerCase(), isActive: true });
      if (!category) return res.json({ data: [], pagination: { page, limit, total: 0, pages: 0 } });
      filter.category = category._id;
    }
  }
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  const sortMap = { newest: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 } };
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);
  res.json({ data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const lookup = mongoose.isObjectIdOrHexString(req.params.id)
    ? { _id: req.params.id }
    : { slug: req.params.id };
  const product = await Product.findOne({ ...lookup, status: 'active' }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const payload = normalizeProduct(req.body);
  payload.slug = await uniqueSlug(req.body.slug || req.body.title);
  const product = await Product.create(payload);
  res.status(201).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const payload = normalizeProduct(req.body);
  if (payload.slug) payload.slug = slugify(payload.slug);
  if (payload.slug) payload.slug = await uniqueSlug(payload.slug, req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).end();
});

exports.uploadMedia = asyncHandler(async (req, res) => {
  const files = req.files || [];
  res.status(201).json({
    data: files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      name: file.originalname,
      type: file.mimetype,
    }))
  });
});

function normalizeProduct(input) {
  const payload = { ...input };
  if (!payload.sku || !String(payload.sku).trim()) delete payload.sku;
  if (!payload.barcode || !String(payload.barcode).trim()) delete payload.barcode;
  if (Array.isArray(payload.inventoryByLocation)) {
    payload.inventoryByLocation = payload.inventoryByLocation
      .filter(location => location && location.name)
      .map(location => ({ name: String(location.name).trim(), quantity: Math.max(0, Number(location.quantity) || 0) }));
    payload.stock = payload.inventoryByLocation.reduce((total, location) => total + location.quantity, 0);
  }
  if (Array.isArray(payload.variants)) {
    payload.variants = payload.variants.map(variant => ({
      ...variant,
      name: String(variant.name || '').trim(),
      sku: String(variant.sku || '').trim(),
      price: Number(variant.price) || 0,
      stock: Math.max(0, Number(variant.stock) || 0),
    }));
  }
  return payload;
}

async function uniqueSlug(value, excludeId) {
  const base = slugify(value) || `product-${Date.now()}`;
  let candidate = base;
  let number = 2;
  while (await Product.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    candidate = `${base}-${number++}`;
  }
  return candidate;
}
