module.exports = {
  Query: {
    getOrders: async (root, args, { models }, info) =>
      models.Order.find({}).populate("_creator", "-password")
  }
};
