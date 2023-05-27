import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type CharacterMessage {
        id: ID!
        content: String
        conversationId: ID
        createdAt: Date
        sender: Character
        senderId: ID
        type: MessageType
        updatedAt: Date
    }

    type UserMessage {
        id: ID!
        content: String
        conversationId: ID
        createdAt: Date
        sender: User
        senderId: ID
        type: MessageType
        updatedAt: Date
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
        ERROR_MESSAGE
    }
`;

export default typeDefs;