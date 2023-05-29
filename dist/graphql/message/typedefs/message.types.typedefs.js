"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
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
exports.default = exports.typeDefs;
