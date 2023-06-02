import gql from "graphql-tag";

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
        characterIds: [ID!]
        orgId: ID!
    }

    input ConversationSearchInput {
        characterIds: [ID!]
        orgId: ID!
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

    # type ConversationUpdatedSubscriptionPayload {
    #     conversation: Conversation
    # }
`;

export default typeDefs;