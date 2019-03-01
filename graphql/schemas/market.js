const { gql } = require("apollo-server-express");

module.exports = gql`
  type Market {
    id: ID!
    symbol: String!
  }

  extend type Query {
    getMarkets: [Market!]
  }
`;
