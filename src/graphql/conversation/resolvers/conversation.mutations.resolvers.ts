import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../../utils/types";
import { Conversation } from "../model/conversation.model";
import { Prisma } from "@prisma/client";

export const characterPopulated = Prisma.validator<Prisma.ConversationCharacterInclude>()({
    character: {
        select: {
            id: true,
            name: true,
        },
    },
});

export const userPopulated = Prisma.validator<Prisma.ConversationUserInclude>()({
    user: {
        select: {
            id: true,
            name: true,
        },
    },
});

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
    characters: {
        include: characterPopulated,
    },
    users: {
        include: userPopulated,
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

export default {
    createConversation: async (_: any, args: any, context: GraphQLContext): Promise<Conversation> => {
        console.log(args);
        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new ApolloError("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new ApolloError("You must be authenticated");
        }

        const { characters, org } = args.input;
        const conversation = await prisma.conversation.create({
            data: {
                characters: {
                    createMany: {
                        data: characters.map((id: string) => ({
                            characterId: id,
                        })),
                    },
                },
                users: {
                    createMany: {
                        data: [user.id].map((id: string) => ({
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
            include: conversationPopulated,
        });

        return {
            id: conversation.id,
        };
    }
};
