import { Conversation } from "@prisma/client";
import { GraphQLContext } from "@types";
import { GraphQLError } from "graphql";
import { CreateConversationArgs, conversationPopulated } from "../types";
import { authenticateContext } from "../../../auth";

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

        // TODO: send a welcome/introductory message from the AI character(s) to the conversation

        pubsub.publish("CONVERSATION_CREATED", {
            conversationCreated: conversation,
        });

        return conversation;
    },
    deleteConversation: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session, pubsub } = context;

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
    markConversationAsRead: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
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

        const { id: conversationId } = args;
        const convoUser = await prisma.conversationUser.findFirst({
            where: {
                conversationId,
                userId: user.id,
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
    }
};
