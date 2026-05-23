const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[32m%s\x1b[0m`, `✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ MongoDB connection failed:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

