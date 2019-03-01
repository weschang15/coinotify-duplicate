const technicalindicators = require("technicalindicators");
technicalindicators.setConfig("precision", 4);
const SMA = technicalindicators.SMA;
const BinanceBase = require("../bases/BinanceBase");

class Boss extends BinanceBase {
  constructor({ market }) {
    super(market);
    this.averages = {};
  }

  async littleBear() {}

  async bigBear() {}

  async papaBear() {}

  qualified() {}

  async all() {}
}

module.exports = Boss;
