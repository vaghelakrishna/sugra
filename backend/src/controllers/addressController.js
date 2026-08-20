const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');

const allowedFields = ['label', 'recipientName', 'phone', 'line1', 'line2', 'city', 'state', 'postalCode', 'country', 'isDefault'];

function addressPayload(body) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.includes(key)));
}

async function unsetDefault(userId, exceptId) {
  const filter = { user: userId, isDefault: true };
  if (exceptId) filter._id = { $ne: exceptId };
  await Address.updateMany(filter, { isDefault: false });
}

exports.listAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
  res.json({ data: addresses });
});

exports.createAddress = asyncHandler(async (req, res) => {
  const payload = addressPayload(req.body);
  const hasAddress = await Address.exists({ user: req.user.id });
  if (payload.isDefault || !hasAddress) await unsetDefault(req.user.id);
  const address = await Address.create({ ...payload, user: req.user.id, isDefault: payload.isDefault || !hasAddress });
  res.status(201).json({ data: address });
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
  if (!address) return res.status(404).json({ message: 'Address not found' });
  const payload = addressPayload(req.body);
  if (payload.isDefault === true) await unsetDefault(req.user.id, address.id);
  Object.assign(address, payload);
  await address.save();
  res.json({ data: address });
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!address) return res.status(404).json({ message: 'Address not found' });
  if (address.isDefault) {
    const replacement = await Address.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (replacement) {
      replacement.isDefault = true;
      await replacement.save();
    }
  }
  res.status(204).end();
});
