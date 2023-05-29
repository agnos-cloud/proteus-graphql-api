"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgPopulated = void 0;
const client_1 = require("@prisma/client");
exports.orgPopulated = client_1.Prisma.validator()({
    members: {
        select: {
            role: true,
            userId: true,
        },
    },
});
