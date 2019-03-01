const bot = require("express").Router();
const ev = require("express-validation");
const { botController } = require("@controllers");
const { catchErrors } = require("@helpers");
const { validateBot, validateBots } = require("@middlewares");

bot
  .route("/")
  .get(catchErrors(botController.getAll))
  .delete(catchErrors(botController.deleteAll))
  .post(ev(validateBot), catchErrors(botController.create));

bot.route("/active").get(catchErrors(botController.getAllActive));

bot
  .route("/batch")
  .post(ev(validateBots), catchErrors(botController.createMultiple));

bot
  .route("/:id")
  .get(catchErrors(botController.get))
  .delete(catchErrors(botController.delete));

module.exports = bot;
