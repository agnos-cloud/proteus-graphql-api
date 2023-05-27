import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../../utils/types";
import { Prisma } from "@prisma/client";
import { ObjectID } from "bson";
import { conversationPopulated } from "../../conversation/resolvers/conversation.mutations.resolvers";
import { getCharacterResponse } from "../../../utils/character";

export const characterMessagePopulated = Prisma.validator<Prisma.CharacterMessageInclude>()({
    sender: {
        select: {
            id: true,
            name: true,
        },
    },
});

export const userMessagePopulated = Prisma.validator<Prisma.UserMessageInclude>()({
    sender: {
        select: {
            id: true,
            name: true,
        },
    },
});

const sendCharacterMessage = async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
    const { pubsub, prisma, session } = context;

    // TODO: authenticate using an access token generated for this character

    const { id: messageId, conversation: conversationId, content, sender: senderId, type } = args.input;

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
            id: messageId,
            conversationId,
            content,
            senderId,
            type: type || "TEXT",
        },
        include: characterMessagePopulated,
    });
    console.log(message);

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

export default {
    sendCharacterMessage,

    sendUserMessage: async (_: any, args: any, context: GraphQLContext): Promise<boolean> => {
        const { prisma, session, pubsub } = context;

        if (!session?.user?.id) {
            throw new GraphQLError("You must be authenticated");
        }

       const { id } = session.user;

       // TODO: no need to fetch the user if all we need is the id above
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new GraphQLError("You must be authenticated");
        }

        const { id: messageId, conversation: conversationId, content, sender: senderId, type } = args.input;

        if (user.id !== senderId) {
            throw new GraphQLError("You must be authorized");
        }

        const message = await prisma.userMessage.create({
            data: {
                id: messageId,
                conversationId,
                content,
                senderId,
                type: type || "TEXT",
            },
            include: userMessagePopulated,
        });

        pubsub.publish("USER_MESSAGE_SENT", {
            userMessageSent: message,
        });

        /*
        * send message to characters for responses
        */
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
                        conversation: conversationId,
                        content: characterResponse,
                        sender: character.characterId,
                        type: responseType,
                    },
                },
                context
            );
        });

        return true;
    }
};
