const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://abidsmuct_db_user:1234@cluster0.f0zincl.mongodb.net/?appName=Cluster0'
    );
    console.log('MongoDB Atlas Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
