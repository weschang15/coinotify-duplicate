const { AuthenticationError } = require("apollo-server-express");

exports.requireAuth = fn => (root, args, context, info) => {
  const { user } = context;
  if (!user) {
    throw new AuthenticationError("You must be logged in.");
  }

  return fn(root, args, context, info);
};
