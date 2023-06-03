import { GraphQLError } from "graphql";
import { GraphQLContext } from "@types";
import { ObjectID } from "bson";
import { conversationPopulated } from "../../conversation/types";
import { getCharacterResponse } from "../../../utils/character";
import { MessageType, SendMessageArgs, characterMessagePopulated, userMessagePopulated } from "../types";
import { authenticateContext } from "../../../auth";

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
                },
            },
        },
    });

    characters.forEach(async (character) => {
        const { content: characterResponse, type: responseType } = await getCharacterResponse(content, {
            characterId: character.characterId,
            prisma,
        });
        sendCharacterMessage(
            _,
            {
                input: {
                    id: new ObjectID().toString(),
                    conversationId,
                    content: characterResponse,
                    senderId: character.characterId,
                    type: responseType,
                },
            },
            context
        );
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
