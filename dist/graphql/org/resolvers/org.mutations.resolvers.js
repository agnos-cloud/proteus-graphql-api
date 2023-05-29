"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _auth_1 = require("@auth");
exports.default = {
    createOrg: async (_, args, context) => {
        const { prisma, session, pubsub } = context;
        await (0, _auth_1.authenticateContext)(context);
        const { name, description } = args.input;
        const org = await prisma.org.create({
            data: {
                name,
                description,
                members: {
                    create: {
                        role: "OWNER",
                        userId: session?.user?.id,
                    }
                },
            },
        });
        pubsub.publish("ORG_CREATED", {
            orgCreated: org,
        });
        return org;
    },
    deleteOpenaiAPIKey: async (_, args, context) => {
        const { prisma, session } = context;
        await (0, _auth_1.authenticateContext)(context);
        const { id: orgId } = args;
        await prisma.org.update({
            where: {
                id: orgId,
            },
            data: {
                openaiApiKey: null,
            },
        });
        return true;
    },
    saveOpenaiAPIKey: async (_, args, context) => {
        const { prisma, session } = context;
        await (0, _auth_1.authenticateContext)(context);
        const { id: orgId, key: openaiApiKey } = args;
        await prisma.org.update({
            where: {
                id: orgId,
            },
            data: {
                openaiApiKey,
            },
        });
        return true;
    }
};
