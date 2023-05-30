import { GraphQLContext } from "@types";
import { GraphQLError } from "graphql";
import { authenticateContext } from "../../../auth";
import { OrgPopulated, orgPopulated } from "../types";

export default {
    org: async (_: any, args: any, context: GraphQLContext): Promise<OrgPopulated> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id } = args;

        const org = await prisma.org.findUnique({
            where: {
                id,
            },
            include: orgPopulated,
        });

        if (!org) {
            throw new GraphQLError("Org not found");
        }

        if (org.members.findIndex((member) => member.userId === session?.user?.id) === -1) {
            throw new GraphQLError("Org not found");
        }

        return org;
    },
    orgs: async (_: any, __: any, context: GraphQLContext): Promise<Array<OrgPopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const orgs = await prisma.org.findMany({
            where: {
                members: {
                    some: {
                        userId: {
                            equals: session?.user?.id!,
                        },
                    },
                },
            },
            include: orgPopulated,
            orderBy: {
                name: "asc",
            },
        });

        return orgs;
    }
};
