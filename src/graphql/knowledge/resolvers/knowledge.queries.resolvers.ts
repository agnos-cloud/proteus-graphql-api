import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { KnowledgePopulated, SearchKnowledgeArgs, knowledgePopulated } from "../types";

export default {
    knowledges: async (_: any, args: SearchKnowledgeArgs, context: GraphQLContext): Promise<Array<KnowledgePopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { characterId } = args.input;

        const knowledges = await prisma.knowledge.findMany({
            where: {
                character: {
                    id: characterId,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: knowledgePopulated,
        });

        return knowledges;
    }
};
