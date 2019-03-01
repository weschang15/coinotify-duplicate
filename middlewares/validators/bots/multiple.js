const Joi = require("joi");

module.exports = {
  options: {
    allowUnknownBody: false,
    allowUnknownHeaders: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
    allowUnknownCookies: false
  },
  body: {
    markets: Joi.array()
      .items(Joi.string().uppercase())
      .required(),
    stopLoss: Joi.number()
      .empty("")
      .default(-3)
      .negative()
      .max(0),
    gainGoal: Joi.number()
      .empty("")
      .default(5)
      .positive()
      .min(0),
    units: Joi.number()
      .empty(0)
      .empty("")
      .default(0.005)
      .greater(0),
    enableBoss: Joi.boolean().default(true),
    autoReboot: Joi.boolean().default(false)
  }
};
