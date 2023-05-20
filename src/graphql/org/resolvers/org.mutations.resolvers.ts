import { GraphQLContext } from "../../../utils/types";
import { Org } from "../model/org.model";

export default {
    createOrg: async (_: any, args: any, context: GraphQLContext): Promise<Org> => {
        console.log(args);
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
    }
};
