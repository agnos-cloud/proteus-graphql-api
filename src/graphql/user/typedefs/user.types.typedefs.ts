import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String
        image: String
    }

    input UserInput {
        name: String!
        org: ID!
        description: String
    }

    input UserSearchInput {
        name: String
        org: ID!
    }
`;

export default typeDefs;