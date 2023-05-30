import gql from "graphql-tag";

export const typeDefs = gql`
    type Character {
        id: ID!
        name: String!
        description: String
        image: String
        createdAt: Date
        updatedAt: Date
    }

    input CharacterInput {
        name: String!
        orgId: ID!
        description: String
    }

    input CharacterSearchInput {
        name: String
        orgId: ID!
    }
`;

export default typeDefs;