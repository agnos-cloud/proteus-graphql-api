import { ChatWidget } from "@prisma/client";
import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CreateChatWidgetArgs, chatWidgetPopulated } from "../types";

export default {
    createChatWidget: async (_: any, args: CreateChatWidgetArgs, context: GraphQLContext): Promise<ChatWidget> => {
        const { prisma, session, pubsub } = context;

        await authenticateContext(context);

        const {
            name,
            characterId,
            description,
            origins,
            primaryColor,
            secondaryColor,
            tertiaryColor,
        } = args.input;
        const chatWidget = await prisma.chatWidget.create({
            data: {
                name,
                description,
                origins,
                primaryColor,
                secondaryColor,
                tertiaryColor,
                character: {
                    connect: {
                        id: characterId,
                    },
                },
            },
            include: chatWidgetPopulated,
        });

        pubsub.publish("CHAT_WIDGET_CREATED", {
            chatWidgetCreated: chatWidget,
        });

        return chatWidget;
    },
};
