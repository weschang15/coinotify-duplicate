module.exports = {
  Query: {
    getMarkets: async (root, args, { models }, info) => models.Market.find({})
  }
};
