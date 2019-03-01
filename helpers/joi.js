const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const defaults = Joi.defaults(schema =>
  schema.options({
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  })
);

module.exports = defaults;
