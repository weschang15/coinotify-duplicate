const { Market } = require("../models");
const axios = require("axios");

exports.retrieveBinanceMarkets = async (req, res, next) => {
  const [binanceData, bittrexData, storedMarkets] = await Promise.all([
    axios.get("https://api.binance.com/api/v1/exchangeInfo"),
    axios.get("https://bittrex.com/api/v1.1/public/getmarkets"),
    Market.find({}, "symbol -_id")
  ]);

  const { symbols: binanceSyms } = binanceData.data;
  const binanceMarkets = binanceSyms
    .map(
      symbol =>
        symbol.quoteAsset === "BTC" || symbol.baseAsset === "BTC"
          ? `${symbol.quoteAsset}-${symbol.baseAsset}`
          : false
    )
    .filter(Boolean);

  const { result: bittrexSyms } = bittrexData.data;
  const bittrexMarkets = bittrexSyms.map(symbol => symbol.MarketName);

  const tradeableMarkets = binanceMarkets.filter(market => {
    return bittrexMarkets.includes(market);
  });

  const availableMarkets = tradeableMarkets.map(market => ({ symbol: market }));

  const isEqual = (a, b) => {
    if (a.length !== b.length) {
      return false;
    }

    const compare = (x, y) => {
      if (x.symbol < y.symbol) return -1;
      if (x.symbol > y.symbol) return 1;

      return 0;
    };

    const sortedA = a.sort(compare);
    const sortedB = b.sort(compare);

    return sortedA.every((item, index) => {
      return item.symbol === sortedB[index].symbol;
    });
  };

  if (isEqual(storedMarkets, availableMarkets)) {
    throw new Error("No new markets available.");
  }

  const marketsToAdd = availableMarkets.filter(availableMarket => {
    return !storedMarkets.some(storedMarket => {
      return availableMarket.symbol === storedMarket.symbol;
    });
  });

  req.markets = marketsToAdd;
  return next();
};
