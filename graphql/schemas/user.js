const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    orders: [Order!]!
  }

  type RegisterUserResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginUserResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    registerUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): RegisterUserResponse!

    loginUser(email: String!, password: String!): LoginUserResponse!
    logoutUser: Boolean!
  }
`;
