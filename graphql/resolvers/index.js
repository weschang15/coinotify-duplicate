const { merge } = require("lodash");
const bot = require("./bot/resolvers");
const market = require("./market");
const order = require("./order");
const user = require("./user");

module.exports = merge({}, bot, market, order, user);
