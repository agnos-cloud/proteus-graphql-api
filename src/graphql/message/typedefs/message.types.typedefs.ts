import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type CharacterMessage {
        id: ID!
        content: String
        createdAt: Date
        sender: Character
        type: MessageType
    }

    type UserMessage {
        id: ID!
        content: String
        createdAt: Date
        sender: User
        type: MessageType
    }

    input MessageInput {
        id: ID
        content: String
        conversation: ID!
        sender: ID!
        type: MessageType
    }

    input MessageSearchInput {
        conversation: ID!
    }

    enum MessageType {
        TEXT
    }
`;

export default typeDefs;