const { btxClient } = require("./axios");
const { AppError } = require("@errors");

class Bittrex {
  constructor({ base, apiKey, apiSecret }) {
    let baseURL = base || "https://bittrex.com/api/v1.1";
    this.http = btxClient({ base: baseURL, apiKey, apiSecret });
  }

  async cancelOrder({ uuid }) {
    const params = { uuid };
    const endpoint = `/market/cancel`;

    const res = await this.http.get(endpoint, { params });
    const { data } = res;

    return data;
  }

  /**
   *
   * @param {Object} order - The order that should be placed
   * @param {string} order.type - A string literal for the type of order to place (ex. buylimit|selllimit)
   * @param {string} order.market - A string literal for the target market to buy (ex. BTC-LTC)
   * @param {string} order.quantity - The amount of market to purchase
   * @param {string} order.rate - The rate of target market at which to place the order
   */
  async createOrder({ type, market, quantity, rate }) {
    if (!type) {
      throw new AppError("Undefined argument 'type'", 500, false);
    }

    const endpoint = `/market/${type}`;
    const params = { market, quantity, rate };
    const res = await this.http.get(endpoint, { params });
    const { success, message, result } = res.data;

    return { success, message, result };
  }

  /**
   *
   * @param {Object} order - The order to search for
   * @param {string} order.uuid - The Bittrex order ID
   */
  async getOrder({ uuid }) {
    const params = { uuid };
    const endpoint = `/account/getorder`;

    const res = await this.http.get(endpoint, { params });
    const { success, message, result } = res.data;

    return { success, message, result };
  }
}

module.exports = Bittrex;
