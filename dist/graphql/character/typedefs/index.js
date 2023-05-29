"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const character_mutations_typedefs_1 = __importDefault(require("./character.mutations.typedefs"));
const character_queries_typedefs_1 = __importDefault(require("./character.queries.typedefs"));
const character_types_typedefs_1 = __importDefault(require("./character.types.typedefs"));
const typeDefs = [character_types_typedefs_1.default, character_queries_typedefs_1.default, character_mutations_typedefs_1.default];
exports.default = typeDefs;
