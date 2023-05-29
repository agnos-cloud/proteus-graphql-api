import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createOrg(input: CreateOrgInput!): Org!
        deleteOpenaiAPIKey(id: ID!): Boolean
        saveOpenaiAPIKey(id: ID! key: String!): Boolean
    }
`;

export default typeDefs;