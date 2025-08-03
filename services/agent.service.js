const Agent = require('../models/agent.model');

const agentService = {
  create: async (data, session = null) => {
    return await Agent.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Agent.findOne(query),
  update: async (query, updateObj) => await Agent.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj, session = null) => await Agent.findOneAndUpdate(query, updateObj, { new: true, upsert: true, session }),
  delete: async (query) => await Agent.findOneAndDelete(query),
  list: async (query = {}) => await Agent.find(query).sort({ createdAt: -1 })
};

module.exports = { agentService };
