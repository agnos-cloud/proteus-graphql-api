"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const character_1 = __importDefault(require("./character"));
const conversation_1 = __importDefault(require("./conversation"));
const message_1 = __importDefault(require("./message"));
const org_1 = __importDefault(require("./org"));
const user_1 = __importDefault(require("./user"));
const scalar_1 = __importDefault(require("./scalar"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
exports.default = {
    resolvers: (0, lodash_merge_1.default)({}, character_1.default.resolvers, conversation_1.default.resolvers, message_1.default.resolvers, org_1.default.resolvers, scalar_1.default),
    typeDefs: [
        ...character_1.default.typeDefs,
        ...conversation_1.default.typeDefs,
        ...message_1.default.typeDefs,
        ...org_1.default.typeDefs,
        ...user_1.default.typeDefs,
    ],
};
