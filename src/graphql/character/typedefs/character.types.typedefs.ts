import gql from "graphql-tag";

export const typeDefs = gql`
    type Character {
        id: ID!
        name: String!
        createdAt: Date!
        description: String
        image: String
        instruction: String
        modelFamily: ModelFamily!
        plan: Plan!
        planExpiresAt: Date
        updatedAt: Date!
    }

    enum ModelFamily {
        GOOGLE_AI
        OPENAI
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

    input SaveCharacterInstructionInput {
        id: ID!
        orgId: ID!
        instruction: String!
    }
`;

export default typeDefs;