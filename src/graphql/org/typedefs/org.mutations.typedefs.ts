import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createOrg(input: OrgInput!): Org!
        deleteOpenaiAPIKey(id: ID!): Boolean
        saveOpenaiAPIKey(id: ID! key: String!): Boolean
    }
`;

export default typeDefs;