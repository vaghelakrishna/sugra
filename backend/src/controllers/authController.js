const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendPasswordResetEmail } = require('../services/emailService');

function issueToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(res, statusCode, user) {
  res.status(statusCode).json({ token: issueToken(user), user });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) return res.status(409).json({ message: 'An account already exists for this email' });

  // Public registration always creates customer accounts.
  const user = await User.create({ name, email: normalizedEmail, password, role: 'customer' });
  sendAuthResponse(res, 201, user);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !user.isActive || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  sendAuthResponse(res, 200, user);
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ data: req.user });
});

exports.logout = (_req, res) => {
  // JWTs are stateless. The client removes its token; a token blocklist can be added later if needed.
  res.status(204).end();
};

exports.googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Google credential is required' });
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google login is not configured' });
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || !payload.email_verified) return res.status(401).json({ message: 'Google account could not be verified' });
  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }] });
  if (!user) user = await User.create({ name: payload.name || payload.email.split('@')[0], email: payload.email, googleId: payload.sub });
  else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save();
  }
  if (!user.isActive) return res.status(401).json({ message: 'User account is unavailable' });
  sendAuthResponse(res, 200, user);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordResetToken +passwordResetExpires');
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8) return res.status(400).json({ message: 'A valid reset token and 8+ character password are required' });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ passwordResetToken: tokenHash, passwordResetExpires: { $gt: new Date() } }).select('+password +passwordResetToken +passwordResetExpires');
  if (!user) return res.status(400).json({ message: 'Reset token is invalid or expired' });
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendAuthResponse(res, 200, user);
});
