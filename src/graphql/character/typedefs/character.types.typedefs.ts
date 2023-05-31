import gql from "graphql-tag";

export const typeDefs = gql`
    type Character {
        id: ID!
        name: String!
        createdAt: Date
        description: String
        image: String
        plan: Plan
        planExpiresAt: Date
        updatedAt: Date
    }

    enum Plan {
        ADVANCED
        BASIC
        FREE
        PRO
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