"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
    type User {
        id: ID!
        name: String
        email: String
        image: String
    }

    input UserInput {
        name: String!
        org: ID!
        description: String
    }

    input UserSearchInput {
        name: String
        org: ID!
    }
`;
exports.default = exports.typeDefs;
