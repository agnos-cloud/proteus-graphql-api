"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const org_mutations_resolvers_1 = __importDefault(require("./org.mutations.resolvers"));
const org_queries_resolvers_1 = __importDefault(require("./org.queries.resolvers"));
exports.default = {
    Mutation: org_mutations_resolvers_1.default,
    Query: org_queries_resolvers_1.default,
    // Subscription,
};
