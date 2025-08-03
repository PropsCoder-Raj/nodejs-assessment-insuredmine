const Policy = require('../models/Policy');

const policyService = {
  create: async (data) => await Policy.create(data),
  findOne: async (query) => await Policy.findOne(query),
  update: async (query, updateObj) => await Policy.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await Policy.findOneAndDelete(query),
  list: async (query = {}) => await Policy.find(query).sort({ createdAt: -1 }),
};

module.exports = { policyService };
