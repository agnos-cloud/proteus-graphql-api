import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type Conversation {
        id: ID!
        characters: [ConversationCharacter!]!
        createdAt: Date
        latestMessage: CharacterMessage
        org: Org
        state: String
        updatedAt: Date
        users: [ConversationUser!]!
    }

    input ConversationInput {
        characterIds: [ID!]
        orgId: ID!
    }

    input ConversationSearchInput {
        characterIds: [ID!]
        orgId: ID!
    }

    input ConversationStateInput {
        id: ID!
        key: String!
        value: String!
        parseValue: Boolean
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