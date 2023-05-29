"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMessagePopulated = exports.characterMessagePopulated = void 0;
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
const bson_1 = require("bson");
const conversation_mutations_resolvers_1 = require("../../conversation/resolvers/conversation.mutations.resolvers");
const character_1 = require("../../../utils/character");
exports.characterMessagePopulated = client_1.Prisma.validator()({
    sender: {
        select: {
            id: true,
            name: true,
        },
    },
});
exports.userMessagePopulated = client_1.Prisma.validator()({
    sender: {
        select: {
            id: true,
            name: true,
        },
    },
});
const sendCharacterMessage = async (_, args, context) => {
    const { pubsub, prisma, session } = context;
    // TODO: authenticate using an access token generated for this character
    const { id: messageId, conversation: conversationId, content, sender: senderId, type } = args.input;
    const character = await prisma.character.findUnique({
        where: {
            id: senderId,
        },
    });
    if (!character) {
        throw new graphql_1.GraphQLError("You must be authenticated");
    }
    const message = await prisma.characterMessage.create({
        data: {
            id: messageId,
            conversationId,
            content,
            senderId,
            type: type || "TEXT",
        },
        include: exports.characterMessagePopulated,
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
        include: conversation_mutations_resolvers_1.conversationPopulated,
    });
    pubsub.publish("CHARACTER_MESSAGE_SENT", {
        characterMessageSent: message,
    });
    pubsub.publish("CONVERSATION_UPDATED", {
        conversationUpdated: conversation,
    });
    return true;
};
exports.default = {
    sendCharacterMessage,
    sendUserMessage: async (_, args, context) => {
        const { prisma, session, pubsub } = context;
        if (!session?.user?.id) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { id } = session.user;
        // TODO: no need to fetch the user if all we need is the id above
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { id: messageId, conversation: conversationId, content, sender: senderId, type } = args.input;
        if (user.id !== senderId) {
            throw new graphql_1.GraphQLError("You must be authorized");
        }
        const message = await prisma.userMessage.create({
            data: {
                id: messageId,
                conversationId,
                content,
                senderId,
                type: type || "TEXT",
            },
            include: exports.userMessagePopulated,
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
            const { content: characterResponse, type: responseType } = await (0, character_1.getCharacterResponse)(content, {
                characterId: character.characterId,
                prisma,
            });
            sendCharacterMessage(_, {
                input: {
                    id: new bson_1.ObjectID().toString(),
                    conversation: conversationId,
                    content: characterResponse,
                    sender: character.characterId,
                    type: responseType,
                },
            }, context);
        });
        return true;
    }
};
