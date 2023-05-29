"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_mutations_resolvers_1 = __importDefault(require("./conversation.mutations.resolvers"));
const conversation_queries_resolvers_1 = __importDefault(require("./conversation.queries.resolvers"));
const conversation_subscriptions_resolvers_1 = __importDefault(require("./conversation.subscriptions.resolvers"));
exports.default = {
    Mutation: conversation_mutations_resolvers_1.default,
    Query: conversation_queries_resolvers_1.default,
    Subscription: conversation_subscriptions_resolvers_1.default,
};
