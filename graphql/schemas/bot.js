const { gql } = require("apollo-server-express");

module.exports = gql`
  type Bot {
    id: ID!
    marketName: String!
    stopLoss: Float!
    gainGoal: Float!
    units: Float!
    enableBoss: Boolean!
    autoReboot: Boolean!
  }

  type GetBotResponse {
    ok: Boolean!
    bot: Bot
    errors: [Error!]
  }

  extend type Query {
    getBot(id: ID!): GetBotResponse!
  }

  type CreateBotResponse {
    ok: Boolean!
    bot: Bot
    errors: [Error!]
  }

  type CreateBotsResponse {
    ok: Boolean!
    bots: [Bot!]
    errors: [Error!]
  }

  input BotInput {
    marketName: String!
    stopLoss: Float
    gainGoal: Float
    units: Float
    enableBoss: Boolean
    autoReboot: Boolean
  }

  input BotsInput {
    markets: [String!]!
    stopLoss: Float
    gainGoal: Float
    units: Float
    enableBoss: Boolean
    autoReboot: Boolean
  }

  extend type Mutation {
    createBot(input: BotInput!): CreateBotResponse!
    createBots(input: BotsInput!): CreateBotsResponse!
  }
`;
