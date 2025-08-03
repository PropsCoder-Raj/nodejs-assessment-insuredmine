const Account = require('../models/account.model');

const accountService = {
  create: async (data) => await Account.create(data),
  findOne: async (query) => await Account.findOne(query),
  update: async (query, updateObj) => await Account.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await Account.findOneAndDelete(query),
  list: async (query = {}) => await Account.find(query).sort({ createdAt: -1 }),
};

module.exports = { accountService };
