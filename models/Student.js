const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  _id: {
    type: String,   // এখন তুমি নিজে ID দিতে পারবে
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Student', studentSchema);
