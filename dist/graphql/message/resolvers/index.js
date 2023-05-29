"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_mutations_resolvers_1 = __importDefault(require("./message.mutations.resolvers"));
const message_queries_resolvers_1 = __importDefault(require("./message.queries.resolvers"));
const message_subscriptions_resolvers_1 = __importDefault(require("./message.subscriptions.resolvers"));
exports.default = {
    Mutation: message_mutations_resolvers_1.default,
    Query: message_queries_resolvers_1.default,
    Subscription: message_subscriptions_resolvers_1.default,
};
