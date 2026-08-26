const mongoose = require('mongoose');
const User = require('../models/User');

async function ensureAdminAccount() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'shopsugrajewels@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'sugrajewels@123';
    const adminName = process.env.ADMIN_NAME || 'SUGRA Admin';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log(`✅ Admin account created: ${adminEmail}`);
    } else {
      admin.role = 'admin';
      admin.isActive = true;
      admin.password = adminPassword; // Triggers bcrypt pre-save hash
      await admin.save();
      console.log(`✅ Admin credentials synchronized: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error ensuring admin account:', err.message);
  }
}

async function connectDatabase() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not set; database-backed endpoints will be unavailable.');
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  await ensureAdminAccount();
}

module.exports = connectDatabase;
