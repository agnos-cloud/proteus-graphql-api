import { GraphQLContext } from "@types";
import { GraphQLError } from "graphql";

export async function authenticateContext(context: GraphQLContext): Promise<boolean> {
    const { prisma, session } = context;

    if (!session?.user?.id) {
        throw new GraphQLError("You must be authenticated");
    }

    const { id } = session.user;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new GraphQLError("You must be authenticated");
    }

    return true;
}
