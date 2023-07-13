import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { ChatWidgetPopulated, GetChatWidgetArgs, SearchChatWidgetArgs, chatWidgetPopulated } from "../types";
import { GraphQLError } from "graphql";

export default {

    chatWidget: async (_: any, args: GetChatWidgetArgs, context: GraphQLContext): Promise<ChatWidgetPopulated> => {
        const { prisma } = context;

        await authenticateContext(context);

        const { id } = args;

        const chatWidget = await prisma.chatWidget.findUnique({
            where: {
                id,
            },
            include: chatWidgetPopulated,
        });
        
        if (!chatWidget) {
            throw new GraphQLError("chatWidget not found");
        }
        return chatWidget;
    },

    chatWidgets: async (_: any, args: SearchChatWidgetArgs, context: GraphQLContext): Promise<Array<ChatWidgetPopulated>> => {
        const { prisma } = context;

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
