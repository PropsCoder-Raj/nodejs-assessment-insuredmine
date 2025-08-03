const Account = require('../models/account.model');

const accountService = {
  create: async (data, session = null) => {
    return await Account.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Account.findOne(query),
  update: async (query, updateObj) => await Account.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj, session = null) => await Account.findOneAndUpdate(query, updateObj, { new: true, upsert: true, session }),
  delete: async (query) => await Account.findOneAndDelete(query),
  list: async (query = {}) => await Account.find(query).sort({ createdAt: -1 })
};

module.exports = { accountService };
