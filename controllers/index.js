/**
 * * Group exporting
 *
 * Use this file to require in all of your modules and then export each one all at once.
 * This allows you to refactor your require statements across your application. See example:
 *
 */

const accountController = require("./accountController");
const marketController = require("./marketController");
const botController = require("./botController");
const userController = require("./userController");

module.exports = {
  accountController,
  marketController,
  botController,
  userController
};
