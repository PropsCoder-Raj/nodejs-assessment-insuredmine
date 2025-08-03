const Carrier = require('../models/carrier.model');

const carrierService = {
  create: async (data, session = null) => {
    return await Carrier.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Carrier.findOne(query),
  update: async (query, updateObj) => await Carrier.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj, session = null) => await Carrier.findOneAndUpdate(query, updateObj, { new: true, upsert: true, session }),
  delete: async (query) => await Carrier.findOneAndDelete(query),
  list: async (query = {}) => await Carrier.find(query).sort({ createdAt: -1 })
};

module.exports = { carrierService };
