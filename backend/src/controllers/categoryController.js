const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');

exports.listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ data: categories });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ data: category });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  payload.slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
  const category = await Category.create(payload);
  res.status(201).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.slug) payload.slug = slugify(payload.slug);
  const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.status(204).end();
});
