"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_mutations_typedefs_1 = __importDefault(require("./message.mutations.typedefs"));
const message_queries_typedefs_1 = __importDefault(require("./message.queries.typedefs"));
const message_types_typedefs_1 = __importDefault(require("./message.types.typedefs"));
const message_subscriptions_typedefs_1 = __importDefault(require("./message.subscriptions.typedefs"));
const typeDefs = [message_types_typedefs_1.default, message_queries_typedefs_1.default, message_mutations_typedefs_1.default, message_subscriptions_typedefs_1.default];
exports.default = typeDefs;
