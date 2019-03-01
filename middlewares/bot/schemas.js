const yup = require("yup");

const createBotSchema = yup.object().shape({
  url: yup
    .string()
    .url()
    .trim()
    .required(),
  repeat: yup
    .number()
    .oneOf([0, 15, 30, 60])
    .default(0),
  categories: yup
    .array()
    .of(yup.string())
    .default(["accessibility", "best-practices", "performance", "pwa", "seo"])
});

module.exports = { createBotSchema };
