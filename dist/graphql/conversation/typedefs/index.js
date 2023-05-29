"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_mutations_typedefs_1 = __importDefault(require("./conversation.mutations.typedefs"));
const conversation_queries_typedefs_1 = __importDefault(require("./conversation.queries.typedefs"));
const conversation_types_typedefs_1 = __importDefault(require("./conversation.types.typedefs"));
const conversation_subscriptions_typedefs_1 = __importDefault(require("./conversation.subscriptions.typedefs"));
const typeDefs = [conversation_types_typedefs_1.default, conversation_queries_typedefs_1.default, conversation_mutations_typedefs_1.default, conversation_subscriptions_typedefs_1.default];
exports.default = typeDefs;
