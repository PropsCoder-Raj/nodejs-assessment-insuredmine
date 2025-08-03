const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
