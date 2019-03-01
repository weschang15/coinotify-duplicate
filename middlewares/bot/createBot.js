const { extractErrors, withCatch } = require("@helpers");
const { createBotSchema } = require("./schemas");
const { requireAuth } = require("../auth");

module.exports = {
  Mutation: {
    createBot: requireAuth(async (resolve, root, args, context, info) => {
      const validateInput = () =>
        createBotSchema.validate(args.input, { abortEarly: false });
      const [err, result] = await withCatch(validateInput());

      if (err) return { ok: false, errors: extractErrors(err) };
      const updatedArgs = Object.assign({}, args, { input: result });
      return resolve(root, updatedArgs, context, info);
    })
  }
};
