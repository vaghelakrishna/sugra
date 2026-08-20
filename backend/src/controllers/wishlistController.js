const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

async function getWishlist(userId) {
  return Wishlist.findOne({ user: userId }).populate({
    path: 'items.product',
    match: { status: 'active' },
    select: 'title slug price compareAtPrice images stock status',
  });
}

exports.getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlist(req.user.id);
  res.json({ data: { items: (wishlist?.items || []).filter((item) => item.product) } });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });
  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product) return res.status(404).json({ message: 'Product not found or unavailable' });

  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user.id, items: [] });
  const exists = wishlist.items.some((item) => item.product.equals(product._id));
  if (!exists) {
    wishlist.items.push({ product: product._id });
    await wishlist.save();
  }
  res.status(exists ? 200 : 201).json({ data: { items: (await getWishlist(req.user.id)).items } });
});

exports.deleteItem = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  const item = wishlist?.items.id(req.params.id);
  if (!item) return res.status(404).json({ message: 'Wishlist item not found' });
  wishlist.items.pull(req.params.id);
  await wishlist.save();
  res.status(204).end();
});
