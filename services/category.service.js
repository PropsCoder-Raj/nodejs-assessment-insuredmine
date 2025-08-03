const Category = require('../models/category.model');

const categoryService = {
  create: async (data, session = null) => {
    return await Category.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Category.findOne(query),
  update: async (query, updateObj) => await Category.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj) => await Category.findOneAndUpdate(query, updateObj, { new: true, upsert: true }),
  delete: async (query) => await Category.findOneAndDelete(query),
  list: async (query = {}) => await Category.find(query).sort({ createdAt: -1 })
};

module.exports = { categoryService };
