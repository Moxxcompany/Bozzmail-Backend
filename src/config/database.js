const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const {
  MONGODB_URL
} = require('../constant/constants')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;