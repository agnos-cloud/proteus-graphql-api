"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const org_mutations_typedefs_1 = __importDefault(require("./org.mutations.typedefs"));
const org_queries_typedefs_1 = __importDefault(require("./org.queries.typedefs"));
const org_types_typedefs_1 = __importDefault(require("./org.types.typedefs"));
const org_subscriptions_typedefs_1 = __importDefault(require("./org.subscriptions.typedefs"));
const typeDefs = [org_types_typedefs_1.default, org_queries_typedefs_1.default, org_mutations_typedefs_1.default, org_subscriptions_typedefs_1.default];
exports.default = typeDefs;
