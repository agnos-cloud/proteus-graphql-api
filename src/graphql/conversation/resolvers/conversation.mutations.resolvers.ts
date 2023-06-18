import { Conversation } from "@prisma/client";
import { GraphQLContext } from "@types";
import { GraphQLError } from "graphql";
import {
    CreateConversationArgs,
    DeleteConversationArgs,
    MarkConversationAsReadArgs,
    SetConversationStateArgs,
    conversationPopulated
} from "../types";
import { authenticateContext } from "../../../auth";
import { triggerCharacterResponse } from "../../../graphql/message/resolvers/message.mutations.resolvers";

export default {
    createConversation: async (_: any, args: CreateConversationArgs, context: GraphQLContext): Promise<Conversation> => {
        const { prisma, session, pubsub } = context;

        await authenticateContext(context);

        const { characterIds, orgId } = args.input;
        const userId = session?.user?.id;
        const conversation = await prisma.conversation.create({
            data: {
                characters: {
                    createMany: {
                        data: characterIds.map((id: string) => ({
                            characterId: id,
                        })),
                    },
                },
                users: {
                    createMany: {
                        data: [userId].map((id: string) => ({
                            hasUnread: id !== userId,
                            userId: id,
                        })),
                    },
                },
                org: {
                    connect: {
                        id: orgId,
                    },
                },
            },
            include: conversationPopulated,
        });

        // this triggers the characters in this new conversation to introduce themselves
        await triggerCharacterResponse(_, {
            content: "Hello, can you introduce yourself and welcome me?",
            conversationId: conversation.id,
        }, context);

        pubsub.publish("CONVERSATION_CREATED", {
            conversationCreated: conversation,
        });

        return conversation;
    },
    deleteConversation: async (_: any, args: DeleteConversationArgs, context: GraphQLContext): Promise<boolean> => {
        const { prisma, pubsub } = context;

        await authenticateContext(context);

        const { id: conversationId } = args;
        const [ deletedConversation ] = await prisma.$transaction([
            prisma.conversation.delete({
                where: {
                    id: conversationId,
                },
                include: conversationPopulated,
            }),
            prisma.conversationCharacter.deleteMany({
                where: {
                    conversationId,
                },
            }),
            prisma.conversationUser.deleteMany({
                where: {
                    conversationId,
                },
            }),
        ]);

        pubsub.publish("CONVERSATION_DELETED", {
            conversationDeleted: deletedConversation,
        });

        return true;
    },
    markConversationAsRead: async (_: any, args: MarkConversationAsReadArgs, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id: conversationId } = args;
        const convoUser = await prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId: session?.user?.id,
            },
        });
        if (convoUser) {
            await prisma.conversationUser.update({
                where: {
                    id: convoUser.id,
                },
                data: {
                    hasUnread: false,
                },
            });
        }

        return true;
    },
    setConversationState: async (_: any, args: SetConversationStateArgs, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id: conversationId, key, value, parseValue } = args.input;
        const convo = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
            },
        });
        if (!convo) {
            throw new GraphQLError("Conversation not found");
        }
        const state = JSON.parse(convo.state || "{}");
        state[key] = parseValue ? JSON.parse(value) : value;
        await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                state: JSON.stringify(state),
            },
        });

        return true;
    }
};
