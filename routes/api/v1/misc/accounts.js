const account = require("express").Router();
const { accountController } = require("@controllers");
const { catchErrors } = require("@helpers/errors");

account.get("/orders", catchErrors(accountController.getOrders));
account.get("/balance", catchErrors(accountController.getBalance));

module.exports = account;
