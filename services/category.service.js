const Category = require('../models/category.model');

const categoryService = {
  create: async (data) => await Category.create(data),
  findOne: async (query) => await Category.findOne(query),
  update: async (query, updateObj) => await Category.findOneAndUpdate(query, updateObj, { new: true }),
  delete: async (query) => await Category.findOneAndDelete(query),
  list: async (query = {}) => await Category.find(query).sort({ createdAt: -1 }),
};

module.exports = { categoryService };
