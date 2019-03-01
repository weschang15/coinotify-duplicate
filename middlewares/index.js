/**
 * * Group exporting
 *
 * Use this file to require in all of your modules and then export each one all at once.
 * This allows you to refactor your require statements across your application. See example:
 *
 */

const { currentUser } = require("./auth/currentUser");
const { requireAuth } = require("./auth/requireAuth");
const { errorHandler } = require("./handlers/errors");
const { retrieveBinanceMarkets } = require("./retrieveBinanceMarkets");
const { validateBot, validateBots } = require("./validators/bots/validators");
const validateNewUser = require("./validators/users/createUser");
const validateLogin = require("./validators/users/loginUser");

module.exports = {
  currentUser,
  errorHandler,
  requireAuth,
  retrieveBinanceMarkets,
  validateBot,
  validateBots,
  validateNewUser,
  validateLogin
};
