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
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  }
};
