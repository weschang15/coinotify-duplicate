const { Authentication } = require("@services");
const { extractErrors, withCatch } = require("@helpers");

module.exports = {
  Query: {
    me: async (root, args, { req }, info) => {
      const findUser = () => Authentication.me({ req });
      const [error, user] = await withCatch(findUser());
      const response = error ? null : user;

      return response;
    }
  },

  Mutation: {
    logoutUser: async (root, args, { req }, info) =>
      Authentication.logout({ req }),

    loginUser: async (root, args, { models: { User }, req }, info) => {
      const { email, password } = args;
      const findExistingUser = () =>
        Authentication.login({ email, password, req });

      const [err, user] = await withCatch(findExistingUser());
      const response = err
        ? { ok: false, errors: extractErrors(err) }
        : { ok: true, user };

      return response;
    },

    registerUser: async (root, args, { models: { User } }, info) => {
      const createUser = async () => {
        const user = new User(args);
        const result = await user.save();
        return result;
      };

      const [err, user] = await withCatch(createUser());
      const response = err
        ? { ok: false, errors: extractErrors(err) }
        : { ok: true, user };
      return response;
    }
  }
};
