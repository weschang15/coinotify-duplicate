const market = require("express").Router();
const { marketController } = require("@controllers");
const { retrieveBinanceMarkets } = require("@middlewares");
const { catchErrors } = require("@helpers");

// Route for getting a list of cryptos that are shared by both Binance and Bittrex
market.get("/", marketController.all);

// Route for saving all cryptos (to be used in alongside the above route, useful for retrieving new cryptos)
market
  .route("/batch")
  .get(
    catchErrors(retrieveBinanceMarkets),
    catchErrors(marketController.refresh)
  );

module.exports = market;
