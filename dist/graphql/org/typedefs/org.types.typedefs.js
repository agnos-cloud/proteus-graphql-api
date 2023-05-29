"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
    type Membership {
        id: ID!
        orgId: String!
        role: Role
        userId: String!
    }

    enum Role {
        GUEST
        MEMBER
        OWNER
    }

    type Org {
        id: ID!
        name: String!
        description: String
        members: [Membership!]!
    }

    input CreateOrgInput {
        name: String!
        description: String
    }
`;
exports.default = exports.typeDefs;
