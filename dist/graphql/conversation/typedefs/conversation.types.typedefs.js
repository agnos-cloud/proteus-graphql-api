"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
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
        org: ID
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

    # type ConversationUpdatedSubscriptionPayload {
    #     conversation: Conversation
    # }
`;
exports.default = exports.typeDefs;
