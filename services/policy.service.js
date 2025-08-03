const Policy = require('../models/policy.model');

const policyService = {
  create: async (data, session = null) => {
    return await Policy.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Policy.findOne(query),
  update: async (query, updateObj) => await Policy.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj, session = null) => await Policy.findOneAndUpdate(query, updateObj, { new: true, upsert: true, session }),
  delete: async (query) => await Policy.findOneAndDelete(query),
  list: async (query = {}, populateFields = []) => {
    let q = Policy.find(query);
    populateFields.forEach(field => q = q.populate(field));
    return await q.sort({ createdAt: -1 });
  },
  aggregate: async (pipeline) => await Policy.aggregate(pipeline)
};

module.exports = { policyService };
