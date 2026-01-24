// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://abidsmuct_db_user:1234@cluster0.f0zincl.mongodb.net/?appName=Cluster0';
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
