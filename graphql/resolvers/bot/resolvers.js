const { requireAuth } = require("@middlewares");
const { validateBot, validateBots } = require("@middlewares");
const controller = require("./controller");

module.exports = {
  Query: {},

  Mutation: {
    createBot: requireAuth(validateBot(controller.createOne)),
    createBots: requireAuth(validateBots(controller.createMultiple))
  }
};
