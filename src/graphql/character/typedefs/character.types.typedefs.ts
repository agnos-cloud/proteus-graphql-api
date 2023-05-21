import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Character {
        id: ID!
        name: String!
        description: String
    }

    input CharacterInput {
        name: String!
        org: ID!
        description: String
    }

    input CharacterSearchInput {
        name: String
        org: ID!
    }
`;

export default typeDefs;