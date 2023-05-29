"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _auth_1 = require("@auth");
const types_1 = require("../types");
exports.default = {
    orgs: async (_, __, context) => {
        const { prisma, session } = context;
        await (0, _auth_1.authenticateContext)(context);
        const orgs = await prisma.org.findMany({
            where: {
                members: {
                    some: {
                        userId: {
                            equals: session?.user?.id,
                        },
                    },
                },
            },
            include: types_1.orgPopulated,
            orderBy: {
                name: "asc",
            },
        });
        return orgs;
    }
};
