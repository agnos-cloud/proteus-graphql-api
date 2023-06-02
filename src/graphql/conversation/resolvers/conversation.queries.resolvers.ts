import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { ConversationPopulated, SearchConversationArgs, conversationPopulated } from "../types";

export default {
    conversations: async (_: any, args: SearchConversationArgs, context: GraphQLContext): Promise<Array<ConversationPopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { orgId } = args.input;

        const conversations = await prisma.conversation.findMany({
            where: {
                users: {
                    some: {
                        userId: {
                            equals: session?.user?.id,
                        },
                    },
                },
                org: {
                    id: orgId,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: conversationPopulated,
        });

        return conversations;
    }
};
