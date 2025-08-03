const Agent = require('../models/Agent');

const agentService = {
  create: async (data) => await Agent.create(data),
  findOne: async (query) => await Agent.findOne(query),
  update: async (query, updateObj) => await Agent.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await Agent.findOneAndDelete(query),
  list: async (query = {}) => await Agent.find(query).sort({ createdAt: -1 }),
};

module.exports = { agentService };
