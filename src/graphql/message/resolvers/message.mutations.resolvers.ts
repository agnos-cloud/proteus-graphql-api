import { Plan } from "@prisma/client";
import { GraphQLContext } from "@types";
import { ObjectID } from "bson";
import { GraphQLError } from "graphql";
import { authenticateContext } from "../../../auth";
import rules from "../../../rules";
import { getCharacterResponse } from "../../../utils/character";
import { conversationPopulated } from "../../conversation/types";
import { MessageType, SendMessageArgs, characterMessagePopulated, userMessagePopulated } from "../types";

export const sendCharacterMessage = async (_: any, args: SendMessageArgs, context: GraphQLContext): Promise<boolean> => {
    const { pubsub, prisma } = context;

    // TODO: authenticate using an access token generated for this character/conversation

    const { id, conversationId, content, senderId, type } = args.input;

    const character = await prisma.character.findUnique({
        where: {
            id: senderId,
        },
    });
    if (!character) {
        throw new GraphQLError("You must be authenticated");
    }

    const message = await prisma.characterMessage.create({
        data: {
            id,
            conversationId,
            content,
            senderId,
            type: type || MessageType.TEXT,
        },
        include: characterMessagePopulated,
    });

    const conversation = await prisma.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            latestMessageId: message.id,
            users: {
                updateMany: {
                    where: {},
                    data: {
                        hasUnread: true,
                    },
                },
            },
        },
        include: conversationPopulated,
    });

    pubsub.publish("CHARACTER_MESSAGE_SENT", {
        characterMessageSent: message,
    });
    pubsub.publish("CONVERSATION_UPDATED", {
        conversationUpdated: conversation,
    });

    return true;
}

export const triggerCharacterResponse = async (_: any, args: { content: string, conversationId: string }, context: GraphQLContext): Promise<boolean> => {
    const { prisma } = context;
    const { conversationId, content } = args

    const characters = await prisma.conversationCharacter.findMany({
        where: {
            conversationId,
        },
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                    modelFamily: true,
                    plan: true,
                    planExpiresAt: true,
                },
            },
        },
    });

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                select: {
                    id: true,
                    conversationId: true,
                    content: true,
                    createdAt: true,
                    senderId: true,
                    type: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: rules.maxConversationMessagesLength(Plan.ADVANCED) * characters.length,
            },
            userMessages: {
                select: {
                    id: true,
                    conversationId: true,
                    content: true,
                    createdAt: true,
                    senderId: true,
                    type: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: rules.maxConversationMessagesLength(Plan.ADVANCED),
            },
        },
    });

    characters.forEach(async (character) => {
        // TODO: check if character has a plan and if it has expired

        const { content: characterResponse, type: characterResponseType } = await getCharacterResponse(content, {
            characterId: character.characterId,
            conversationId,
            prisma,
            messages: conversation.messages.filter((message) => message.senderId === character.characterId),
            userMessages: conversation.userMessages,
        });

        if (characterResponse && characterResponseType) {
            sendCharacterMessage(
                _,
                {
                    input: {
                        id: new ObjectID().toString(),
                        conversationId,
                        content: characterResponse,
                        senderId: character.characterId,
                        type: characterResponseType,
                    },
                },
                context
            );
        }
    });

    return true;
}

export default {
    sendCharacterMessage,

    sendUserMessage: async (_: any, args: SendMessageArgs, context: GraphQLContext): Promise<boolean> => {
        const { prisma, pubsub, session } = context;

        await authenticateContext(context);

        const { id, conversationId, content, senderId, type } = args.input;

        if (session.user?.id !== senderId) {
            throw new GraphQLError("You must be authorized");
        }

        const message = await prisma.userMessage.create({
            data: {
                id,
                conversationId,
                content,
                senderId,
                type: type || MessageType.TEXT,
            },
            include: userMessagePopulated,
        });

        pubsub.publish("USER_MESSAGE_SENT", {
            userMessageSent: message,
        });

        /*
        * send message to characters for responses
        */
        await triggerCharacterResponse(_, { content, conversationId }, context);

        return true;
    }
};
