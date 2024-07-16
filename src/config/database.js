const mongoose = require('mongoose');
const {
  MONGODB_URL
} = require('../constant/constants')
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;