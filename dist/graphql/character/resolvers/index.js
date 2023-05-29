"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const character_mutations_resolvers_1 = __importDefault(require("./character.mutations.resolvers"));
const character_queries_resolvers_1 = __importDefault(require("./character.queries.resolvers"));
exports.default = {
    Mutation: character_mutations_resolvers_1.default,
    Query: character_queries_resolvers_1.default,
    // Subscription,
};
