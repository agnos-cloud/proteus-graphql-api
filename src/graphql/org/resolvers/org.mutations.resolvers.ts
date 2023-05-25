import { Org } from "@prisma/client";
import { GraphQLContext } from "../../../utils/types";

export default {
    createOrg: async (_: any, args: any, context: GraphQLContext): Promise<Org> => {
        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new Error("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new Error("You must be authenticated");
        }

        const { name, description } = args.input;
        const org = await prisma.org.create({
            data: {
                name,
                description,
                memberships: {
                    create: {
                        role: "OWNER",
                        userId: user.id,
                    }
                },
            },
        });

        return org;
    },
    deleteOpenaiAPIKey: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new Error("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new Error("You must be authenticated");
        }

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
    saveOpenaiAPIKey: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new Error("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new Error("You must be authenticated");
        }

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
