const { joi } = require("@helpers");

module.exports = {
  single: {
    marketName: joi
      .string()
      .uppercase()
      .trim()
      .required(),
    stopLoss: joi
      .number()
      .empty("")
      .default(-3)
      .negative()
      .max(0),
    gainGoal: joi
      .number()
      .empty("")
      .default(5)
      .positive()
      .min(0),
    units: joi
      .number()
      .empty(0)
      .empty("")
      .default(0.005)
      .greater(0),
    enableBoss: joi.boolean().default(true),
    autoReboot: joi.boolean().default(false)
  },
  multiple: {
    markets: joi
      .array()
      .items(joi.string().uppercase())
      .required(),
    stopLoss: joi
      .number()
      .empty("")
      .default(-3)
      .negative()
      .max(0),
    gainGoal: joi
      .number()
      .empty("")
      .default(5)
      .positive()
      .min(0),
    units: joi
      .number()
      .empty(0)
      .empty("")
      .default(0.005)
      .greater(0),
    enableBoss: joi.boolean().default(true),
    autoReboot: joi.boolean().default(false)
  }
};
