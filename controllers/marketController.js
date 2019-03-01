const { Market } = require("@models");
const marketController = {};

marketController.all = async (req, res) => {
  const markets = await Market.find({}, req.query.filters);
  res.send(markets);
};

marketController.refresh = async (req, res) => {
  const addedMarkets = await Market.insertMany(req.markets);
  res.send(addedMarkets);
};

module.exports = marketController;
