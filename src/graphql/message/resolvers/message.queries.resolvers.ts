import { UserMessage } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "@types";
import { userIsConversationParticipant } from "../../../utils";
import { conversationPopulated } from "../../conversation/types";
import { SearchMessageArgs, characterMessagePopulated, CharacterMessagePopulated, userMessagePopulated, UserMessagePopulated } from "../types";
import { authenticateContext } from "../../../auth";

export default {
    characterMessages: async (_: any, args: SearchMessageArgs, context: GraphQLContext): Promise<Array<CharacterMessagePopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { conversationId } = args.input;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversationPopulated,
        });

        if (!conversation) {
            throw new GraphQLError("Conversation not found");
        }

        const allowedToView = userIsConversationParticipant(conversation.users, session?.user?.id);

        if (!allowedToView) {
            throw new GraphQLError("You are not allowed to view this conversation");
        }

        const messages = await prisma.characterMessage.findMany({
            where: {
                conversationId,
            },
            include: characterMessagePopulated,
            orderBy: {
                createdAt: "desc",
            },
        });

        return messages;
    },

    userMessages: async (_: any, args: SearchMessageArgs, context: GraphQLContext): Promise<Array<UserMessagePopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { conversationId } = args.input;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversationPopulated,
        });

        if (!conversation) {
            throw new GraphQLError("Conversation not found");
        }

        const allowedToView = userIsConversationParticipant(conversation.users, session?.user?.id);

        if (!allowedToView) {
            throw new GraphQLError("You are not allowed to view this conversation");
        }

        const messages = await prisma.userMessage.findMany({
            where: {
                conversationId,
            },
            include: userMessagePopulated,
            orderBy: {
                createdAt: "desc",
            },
        });

        return messages;
    }
};
