const crypto = require('crypto');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

function createOrderNumber() {
  return `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function getInventory(product, variantId) {
  if (!variantId) return { stock: product.stock, price: product.price, sku: product.sku, image: product.images[0] };
  const variant = product.variants.id(variantId);
  if (!variant) return null;
  return {
    stock: variant.stock,
    price: variant.price ?? product.price,
    sku: variant.sku || product.sku,
    image: variant.image || product.images[0],
  };
}

function addressSnapshot(address) {
  return {
    label: address.label,
    recipientName: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };
}

exports.createOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  if (!addressId) return res.status(400).json({ message: 'addressId is required' });

  const [address, cart] = await Promise.all([
    Address.findOne({ _id: addressId, user: req.user.id }),
    Cart.findOne({ user: req.user.id }),
  ]);
  if (!address) return res.status(404).json({ message: 'Delivery address not found' });
  if (!cart?.items.length) return res.status(400).json({ message: 'Your cart is empty' });

  const items = [];
  for (const cartItem of cart.items) {
    const product = await Product.findOne({ _id: cartItem.product, status: 'active' });
    if (!product) return res.status(400).json({ message: 'One or more cart products are unavailable' });
    const inventory = getInventory(product, cartItem.variantId);
    if (!inventory) return res.status(400).json({ message: `A selected variant is unavailable for ${product.title}` });
    if (cartItem.quantity > inventory.stock) {
      return res.status(400).json({ message: `Only ${inventory.stock} item(s) are available for ${product.title}` });
    }
    items.push({
      product: product._id,
      variantId: cartItem.variantId,
      title: product.title,
      sku: inventory.sku,
      image: inventory.image,
      unitPrice: inventory.price,
      quantity: cartItem.quantity,
      lineTotal: inventory.price * cartItem.quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = 0;
  const discount = 0;
  const order = await Order.create({
    orderNumber: createOrderNumber(),
    user: req.user.id,
    items,
    shippingAddress: addressSnapshot(address),
    subtotal,
    shippingFee,
    discount,
    total: subtotal + shippingFee - discount,
  });

  cart.items = [];
  await cart.save();
  res.status(201).json({ data: order });
});

exports.listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ data: orders });
});

exports.getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ data: order });
});

exports.listAdminOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  const filter = req.query.status ? { status: req.query.status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!orderStatuses.includes(status)) return res.status(400).json({ message: 'Invalid order status' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ data: order });
});
