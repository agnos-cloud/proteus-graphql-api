import { gql } from "apollo-server-core";

export const typeDefs = gql`
    scalar Date

    type Conversation {
        id: ID!
        latestMessage: CharacterMessage
        characters: [ConversationCharacter!]!
        users: [ConversationUser!]!
        createdAt: Date
        updatedAt: Date
        org: Org
    }

    input ConversationInput {
        characters: [ID!]
        org: ID!
    }

    input ConversationSearchInput {
        characters: [ID!]
        org: ID!
        id: ID
    }

    type ConversationCharacter {
        id: ID!
        character: Character
    }

    type ConversationUser {
        id: ID!
        hasUnread: Boolean
        user: User
    }
`;

export default typeDefs;