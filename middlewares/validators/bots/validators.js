const { extractErrors, joi } = require("@helpers");
const { single, multiple } = require("./schema");

exports.validateBot = fn => (root, args, context, info) => {
  const schema = joi.object().keys(single);
  const { error, value } = joi.validate(args, schema);

  if (error) {
    return { ok: false, errors: extractErrors(error) };
  }

  args = value;
  return fn(root, args, context, info);
};

exports.validateBots = fn => (root, args, context, info) => {
  const schema = joi.object().keys(multiple);
  const { error, value } = joi.validate(args, schema);

  if (error) {
    return { ok: false, errors: extractErrors(error) };
  }

  args = value;
  return fn(root, args, context, info);
};
