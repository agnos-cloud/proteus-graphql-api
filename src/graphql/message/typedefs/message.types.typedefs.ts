import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type CharacterMessage {
        id: ID!
        content: String
        createdAt: Date
        sender: Character
    }

    type UserMessage {
        id: ID!
        content: String
        createdAt: Date
        sender: User
    }

    input CharacterMessageInput {
        characters: [ID!]
        org: ID!
    }

    input CharacterMessageSearchInput {
        characters: [ID!]!
        org: ID!
    }
`;

export default typeDefs;