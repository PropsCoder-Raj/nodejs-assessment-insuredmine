const Carrier = require('../models/carrier.model');

const carrierService = {
  create: async (data) => await Carrier.create(data),
  findOne: async (query) => await Carrier.findOne(query),
  update: async (query, updateObj) => await Carrier.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await Carrier.findOneAndDelete(query),
  list: async (query = {}) => await Carrier.find(query).sort({ createdAt: -1 }),
};

module.exports = { carrierService };
