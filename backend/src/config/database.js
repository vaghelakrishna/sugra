const mongoose = require('mongoose');

async function connectDatabase() {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not set; database-backed endpoints will be unavailable.');
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = connectDatabase;
