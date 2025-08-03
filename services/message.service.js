const Message = require('../models/message.model');

const messageService = {
  create: async (data, session = null) => {
    return await Message.create([data], session ? { session } : {});
  },
  findOne: async (query) => await Message.findOne(query),
  update: async (query, updateObj) => await Message.findOneAndUpdate(query, updateObj, { new: true }),
  upsert: async (query, updateObj, session = null) => await Message.findOneAndUpdate(query, updateObj, { new: true, upsert: true, session }),
  delete: async (query) => await Message.findOneAndDelete(query),
  list: async (query = {}) => await Message.find(query).sort({ createdAt: -1 })
};

module.exports = { messageService };
