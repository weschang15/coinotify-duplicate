const { gql } = require("apollo-server-express");

module.exports = gql`
  type Order {
    id: ID!
    name: String!
    type: String!
    status: String!
    gainGoal: Float!
    stopLoss: Float!
    units: Float!
    movingAverages: MovingAverages!
    prices: Prices!
    createdAt: String!
    updatedAt: String!
    _creator: User!
  }

  type MovingAverages {
    littleBear: Float!
    bigBear: Float!
    papaBear: Float!
  }

  type Prices {
    bid: Float!
    ask: Float!
  }

  extend type Query {
    getOrders: [Order!]
  }
`;
