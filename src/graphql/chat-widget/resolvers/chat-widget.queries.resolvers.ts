import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { ChatWidgetPopulated, SearchChatWidgetArgs, chatWidgetPopulated } from "../types";

export default {
    chatWidgets: async (_: any, args: SearchChatWidgetArgs, context: GraphQLContext): Promise<Array<ChatWidgetPopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { characterId } = args.input;

        const chatWidgets = await prisma.chatWidget.findMany({
            where: {
                character: {
                    id: characterId,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: chatWidgetPopulated,
        });

        return chatWidgets;
    }
};
