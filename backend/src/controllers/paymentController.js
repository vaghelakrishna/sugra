const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { getClient, verifyPaymentSignature } = require('../services/razorpayService');

async function deductInventory(items) {
  const deducted = [];
  try {
    for (const item of items) {
      let product;
      if (item.variantId) {
        product = await Product.findOneAndUpdate(
          { _id: item.product, status: 'active', variants: { $elemMatch: { _id: item.variantId, stock: { $gte: item.quantity } } } },
          { $inc: { 'variants.$.stock': -item.quantity } },
          { new: true }
        );
      } else {
        product = await Product.findOneAndUpdate(
          { _id: item.product, status: 'active', stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }
      if (!product) throw new Error(`Insufficient stock for ${item.title}`);
      deducted.push(item);
    }
  } catch (error) {
    await Promise.all(deducted.map((item) => {
      if (item.variantId) {
        return Product.updateOne(
          { _id: item.product, 'variants._id': item.variantId },
          { $inc: { 'variants.$.stock': item.quantity } }
        );
      }
      return Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }));
    throw error;
  }
}

exports.createPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: 'orderId is required' });
  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.payment.status === 'paid') return res.status(409).json({ message: 'This order has already been paid' });
  if (order.status !== 'pending') return res.status(400).json({ message: 'This order cannot be paid in its current state' });

  if (!order.payment.providerOrderId) {
    const razorpayOrder = await getClient().orders.create({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { internalOrderId: order.id, orderNumber: order.orderNumber },
    });
    order.payment.providerOrderId = razorpayOrder.id;
    await order.save();
  }

  res.json({
    data: {
      orderId: order.id,
      razorpayOrderId: order.payment.providerOrderId,
      amount: Math.round(order.total * 100),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature } = req.body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ message: 'orderId and Razorpay payment fields are required' });
  }

  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.payment.status === 'paid') return res.json({ data: order, alreadyVerified: true });
  if (order.payment.providerOrderId !== razorpayOrderId) return res.status(400).json({ message: 'Payment does not belong to this order' });
  if (!verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
    return res.status(400).json({ message: 'Invalid Razorpay payment signature' });
  }

  const lockedOrder = await Order.findOneAndUpdate(
    { _id: order.id, user: req.user.id, status: 'pending', 'payment.status': { $in: ['pending', 'failed'] } },
    { $set: { 'payment.status': 'verifying' } },
    { new: true }
  );
  if (!lockedOrder) return res.status(409).json({ message: 'This payment is already being processed' });

  try {
    await deductInventory(lockedOrder.items);
    lockedOrder.status = 'confirmed';
    lockedOrder.payment.status = 'paid';
    lockedOrder.payment.providerPaymentId = razorpayPaymentId;
    await lockedOrder.save();
    res.json({ data: lockedOrder });
  } catch (error) {
    await Order.findByIdAndUpdate(lockedOrder.id, { $set: { 'payment.status': 'failed' } });
    res.status(409).json({ message: error.message || 'Unable to confirm stock for this payment. Contact support.' });
  }
});
