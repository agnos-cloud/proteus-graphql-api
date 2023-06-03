// import { authenticateContext } from "@auth";
import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CreateOrgArgs, OrgPopulated, orgPopulated } from "../types";

export default {
    createOrg: async (_: any, args: CreateOrgArgs, context: GraphQLContext): Promise<OrgPopulated> => {
        const { prisma, session, pubsub } = context;

        await authenticateContext(context);

        const { name, description } = args.input;
        const org = await prisma.org.create({
            data: {
                name,
                description,
                members: {
                    create: {
                        role: "OWNER",
                        userId: session?.user?.id!,
                    }
                },
            },
            include: orgPopulated,
        });

        pubsub.publish("ORG_CREATED", {
            orgCreated: org,
        });

        return org;
    },
    deleteOpenaiAPIKey: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id } = args;
        await prisma.org.update({
            where: {
                id,
            },
            data: {
                openaiApiKey: null,
            },
        });

        return true;
    },
    saveOpenaiAPIKey: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id, key: openaiApiKey } = args;
        await prisma.org.update({
            where: {
                id,
            },
            data: {
                openaiApiKey,
            },
        });

        return true;
    }
};
