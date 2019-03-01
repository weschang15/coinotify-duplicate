const axios = require("axios");

class BinanceBase {
  constructor(market) {
    if (!market) {
      throw new Error("Undefined argument `market`");
    }

    if (typeof market !== "string") {
      throw new Error("Invalid type for argument `market`");
    }

    const toBinance = () =>
      market
        .split("-")
        .reverse()
        .join("");

    this.btxMarket = market;
    this.bnMarket = toBinance();
    this.client = axios.create({
      baseURL: "https://api.binance.com/api"
    });
  }

  async getCandles({ interval, limit }) {
    const { bnMarket } = this;
    const endpoint = `/v1/klines?interval=${interval}&symbol=${bnMarket}&limit=${limit}`;
    const res = await this.client.get(endpoint);
    const data = await res.data;

    return data;
  }

  async getCurrentPrice() {
    const endpoint = `/v3/ticker/price?symbol=${this.bnMarket}`;
    const res = await this.client.get(endpoint);
    const data = await res.data;

    return data.price;
  }

  extractFromCandles(position, data) {
    return data.reduce((initial, current) => {
      return initial.concat(parseFloat(current[position]));
    }, []);
  }
}

module.exports = BinanceBase;
