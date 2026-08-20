const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication is required' });
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) return res.status(401).json({ message: 'User account is unavailable' });
    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'You do not have permission for this action' });
  next();
};
