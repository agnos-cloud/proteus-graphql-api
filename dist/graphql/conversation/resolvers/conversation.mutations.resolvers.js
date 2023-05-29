"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationPopulated = exports.userPopulated = exports.characterPopulated = void 0;
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
exports.characterPopulated = client_1.Prisma.validator()({
    character: {
        select: {
            id: true,
            name: true,
        },
    },
});
exports.userPopulated = client_1.Prisma.validator()({
    user: {
        select: {
            id: true,
            name: true,
        },
    },
});
exports.conversationPopulated = client_1.Prisma.validator()({
    characters: {
        include: exports.characterPopulated,
    },
    org: {
        select: {
            id: true,
            name: true,
        },
    },
    users: {
        include: exports.userPopulated,
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
});
exports.default = {
    createConversation: async (_, args, context) => {
        const { prisma, session, pubsub } = context;
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
        const { characters, org } = args.input;
        const conversation = await prisma.conversation.create({
            data: {
                characters: {
                    createMany: {
                        data: characters.map((id) => ({
                            characterId: id,
                        })),
                    },
                },
                users: {
                    createMany: {
                        data: [user.id].map((id) => ({
                            hasUnread: id !== user.id,
                            userId: id,
                        })),
                    },
                },
                org: {
                    connect: {
                        id: org,
                    },
                },
            },
            include: exports.conversationPopulated,
        });
        pubsub.publish("CONVERSATION_CREATED", {
            conversationCreated: conversation,
        });
        return {
            id: conversation.id,
        };
    },
    deleteConversation: async (_, args, context) => {
        const { prisma, session, pubsub } = context;
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
        const { id: conversationId } = args;
        const [deletedConversation] = await prisma.$transaction([
            prisma.conversation.delete({
                where: {
                    id: conversationId,
                },
                include: exports.conversationPopulated,
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
    markConversationAsRead: async (_, args, context) => {
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
