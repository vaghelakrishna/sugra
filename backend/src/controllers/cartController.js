const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

function getInventory(product, variantId) {
  if (!variantId) return { stock: product.stock, price: product.price };
  const variant = product.variants.id(variantId);
  if (!variant) return null;
  return { stock: variant.stock, price: variant.price ?? product.price, variant };
}

async function getPopulatedCart(userId) {
  return Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title slug price compareAtPrice stock images status variants',
  });
}

function serializeCart(cart) {
  if (!cart) return { items: [], summary: { itemCount: 0, subtotal: 0 } };
  let itemCount = 0;
  let subtotal = 0;
  const items = cart.items
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      const inventory = getInventory(product, item.variantId);
      const price = inventory?.price ?? product.price;
      itemCount += item.quantity;
      subtotal += price * item.quantity;
      return {
        id: item.id,
        product: product,
        variant: inventory?.variant || null,
        quantity: item.quantity,
        unitPrice: price,
        availableStock: inventory?.stock ?? 0,
      };
    });
  return { items, summary: { itemCount, subtotal } };
}

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user.id);
  res.json({ data: serializeCart(cart) });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.body;
  const quantity = Number(req.body.quantity ?? 1);
  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'A productId and positive integer quantity are required' });
  }

  const product = await Product.findOne({ _id: productId, status: 'active' });
  if (!product) return res.status(404).json({ message: 'Product not found or unavailable' });
  const inventory = getInventory(product, variantId);
  if (!inventory) return res.status(400).json({ message: 'Selected product variant was not found' });

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });
  const item = cart.items.find((cartItem) =>
    cartItem.product.equals(product._id) && String(cartItem.variantId || '') === String(variantId || '')
  );
  const requestedQuantity = (item?.quantity || 0) + quantity;
  if (requestedQuantity > inventory.stock) {
    return res.status(400).json({ message: `Only ${inventory.stock} item(s) are available` });
  }

  if (item) item.quantity = requestedQuantity;
  else cart.items.push({ product: product._id, variantId, quantity });
  await cart.save();

  cart = await getPopulatedCart(req.user.id);
  res.status(201).json({ data: serializeCart(cart) });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }
  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart?.items.id(req.params.id);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });

  const product = await Product.findOne({ _id: item.product, status: 'active' });
  const inventory = product && getInventory(product, item.variantId);
  if (!inventory) return res.status(400).json({ message: 'Product or selected variant is unavailable' });
  if (quantity > inventory.stock) return res.status(400).json({ message: `Only ${inventory.stock} item(s) are available` });

  item.quantity = quantity;
  await cart.save();
  res.json({ data: serializeCart(await getPopulatedCart(req.user.id)) });
});

exports.deleteItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart?.items.id(req.params.id);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  cart.items.pull(req.params.id);
  await cart.save();
  res.status(204).end();
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(204).end();
});
