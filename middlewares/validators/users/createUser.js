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
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required(),
    settings: {
      bittrex: {
        ak: Joi.string(),
        sk: Joi.string()
      }
    }
  }
};
