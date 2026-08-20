const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const slugify = require('../src/utils/slugify');
const { verifyPaymentSignature } = require('../src/services/razorpayService');

test('slugify creates URL-safe slugs', () => assert.equal(slugify(' Gold Ring! '), 'gold-ring'));
test('Razorpay signature verification accepts only valid signatures', () => {
  process.env.RAZORPAY_KEY_SECRET = 'test-secret';
  const signature = crypto.createHmac('sha256', 'test-secret').update('order|payment').digest('hex');
  assert.equal(verifyPaymentSignature({ razorpayOrderId: 'order', razorpayPaymentId: 'payment', razorpaySignature: signature }), true);
  assert.equal(verifyPaymentSignature({ razorpayOrderId: 'order', razorpayPaymentId: 'payment', razorpaySignature: 'invalid' }), false);
});
