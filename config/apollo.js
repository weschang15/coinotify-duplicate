const { ApolloServer, makeExecutableSchema } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { typeDefs, resolvers } = require("@graphql");
const models = require("@models");

const context = ({ req, connection }) => {
  if (connection) {
    return connection.context;
  } else {
    return { models, req, user: req.user };
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema);
const apollo = new ApolloServer({ schema: schemaWithMiddleware, context });

module.exports = {
  init: (app, server) => {
    const config = {
      cors: false,
      bodyParser: false
    };

    apollo.installSubscriptionHandlers(server);
    apollo.applyMiddleware({ app, ...config });
  }
};
