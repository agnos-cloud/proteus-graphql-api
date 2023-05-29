import { UserMessage } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "@types";
import { CharacterMessagePopulated, UserMessagePopulated } from "./message.subscriptions.resolvers";
import { userIsConversationParticipant } from "../../../utils";
import { conversationPopulated } from "../../conversation/resolvers/conversation.mutations.resolvers";
import { characterMessagePopulated, userMessagePopulated } from "./message.mutations.resolvers";

export default {
    characterMessages: async (_: any, args: any, context: GraphQLContext): Promise<Array<CharacterMessagePopulated>> => {
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

        const { conversation: conversationId } = args.input;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversationPopulated,
        });

        if (!conversation) {
            throw new GraphQLError("Conversation not found");
        }

        const allowedToView = userIsConversationParticipant(conversation.users, id);

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

    userMessages: async (_: any, args: any, context: GraphQLContext): Promise<Array<UserMessagePopulated>> => {
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

        const { conversation: conversationId } = args.input;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversationPopulated,
        });

        if (!conversation) {
            throw new GraphQLError("Conversation not found");
        }

        const allowedToView = userIsConversationParticipant(conversation.users, id);

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
