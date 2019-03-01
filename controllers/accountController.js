const axios = require("axios");
const { Order } = require("@models");
const { createApiSign } = require("@helpers");
const accountConroller = {};

accountConroller.getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.send(orders);
};

accountConroller.getBalance = async (req, res) => {
  const nonce = Date.now();
  const url = `https://bittrex.com/api/v1.1/account/getbalance?apikey=${
    process.env.BITTREX_API_KEY
  }&currency=BTC&nonce=${nonce}`;

  const sign = createApiSign(url);
  const response = await axios.get(url, { headers: { apisign: sign } });
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  const results = Object.keys(data.result).reduce((object, key) => {
    if (key !== "CryptoAddress") {
      object[key] = data.result[key];
    }

    return object;
  }, {});

  res.json({ success: data.success, results });
};

module.exports = accountConroller;
