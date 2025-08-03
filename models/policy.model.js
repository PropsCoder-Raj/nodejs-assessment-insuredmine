const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  policyMode: {
    type: Number
  },
  premiumAmountWritten: {
    type: String
  },
  premiumAmount: {
    type: Number
  },
  policyType: {
    type: String
  },
  csr: {
    type: String
  },
  producer: {
    type: String
  },
  primary: {
    type: String
  },
  applicantId: {
    type: String
  },
  agencyId: {
    type: String
  },
  hasActiveClientPolicy: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrier'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
