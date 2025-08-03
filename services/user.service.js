const User = require('../models/user.model');

const userService = {
  create: async (data) => await User.create(data),
  findOne: async (query) => await User.findOne(query),
  update: async (query, updateObj) => await User.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await User.findOneAndDelete(query),
  list: async (query = {}) => await User.find(query).sort({ createdAt: -1 }),
};

module.exports = { userService };
