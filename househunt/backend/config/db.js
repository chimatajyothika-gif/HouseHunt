const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt local or Atlas connection. Fast timeout (3s) to fall back quickly if offline.
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/househunt', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.log('==================================================');
    console.log('⚠️  MongoDB connection refused on localhost:27017');
    console.log('📁 Falling back to local In-Memory / File-based Database.');
    console.log('🚀 No MongoDB installation or Atlas account required!');
    console.log('📁 Your data will be saved locally inside backend/data/');
    console.log('==================================================');
    process.env.USE_MOCK_DB = 'true';
  }
};

module.exports = connectDB;
