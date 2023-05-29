import { authenticateContext } from "../../../auth";
import { GraphQLContext } from "@types";
import { OrgPopulated, orgPopulated } from "../types";

export default {
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
