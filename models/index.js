/**
 * * Group exporting
 *
 * Use this file to require in all of your modules and then export each one all at once.
 * This allows you to refactor your require statements across your application. See example:
 *
 */

const Market = require("./Market");
const Order = require("./Order");
const User = require("./User");

module.exports = { Market, Order, User };
