"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("../../../utils");
const conversation_mutations_resolvers_1 = require("../../conversation/resolvers/conversation.mutations.resolvers");
const message_mutations_resolvers_1 = require("./message.mutations.resolvers");
exports.default = {
    characterMessages: async (_, args, context) => {
        const { prisma, session } = context;
        if (!session?.user?.id) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { id } = session.user;
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { conversation: conversationId } = args.input;
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversation_mutations_resolvers_1.conversationPopulated,
        });
        if (!conversation) {
            throw new graphql_1.GraphQLError("Conversation not found");
        }
        const allowedToView = (0, utils_1.userIsConversationParticipant)(conversation.users, id);
        if (!allowedToView) {
            throw new graphql_1.GraphQLError("You are not allowed to view this conversation");
        }
        const messages = await prisma.characterMessage.findMany({
            where: {
                conversationId,
            },
            include: message_mutations_resolvers_1.characterMessagePopulated,
            orderBy: {
                createdAt: "desc",
            },
        });
        return messages;
    },
    userMessages: async (_, args, context) => {
        const { prisma, session } = context;
        if (!session?.user?.id) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { id } = session.user;
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { conversation: conversationId } = args.input;
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: conversation_mutations_resolvers_1.conversationPopulated,
        });
        if (!conversation) {
            throw new graphql_1.GraphQLError("Conversation not found");
        }
        const allowedToView = (0, utils_1.userIsConversationParticipant)(conversation.users, id);
        if (!allowedToView) {
            throw new graphql_1.GraphQLError("You are not allowed to view this conversation");
        }
        const messages = await prisma.userMessage.findMany({
            where: {
                conversationId,
            },
            include: message_mutations_resolvers_1.userMessagePopulated,
            orderBy: {
                createdAt: "desc",
            },
        });
        return messages;
    }
};
