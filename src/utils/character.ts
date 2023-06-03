import { PrismaClient } from "@prisma/client";
import { MessageType } from "../graphql/message/types";
import { getAiResponse } from "./openai";

export type CharacterContext = {
    characterId: string;
    prisma: PrismaClient;
}

export type CharacterResponse = {
    content: string;
    type: MessageType;
}

export async function getCharacterResponse(prompt: string, context: CharacterContext): Promise<CharacterResponse> {
    const character = await context.prisma.character.findUnique({
        where: {
            id: context.characterId,
        },
        include: {
            org: {
                select: {
                    id: true,
                    name: true,
                    openaiApiKey: true,
                },
            },
        },
    });
    if (!character) {
        throw new Error("Character not found");
    }

    const completePrompt =
    `Your name is ${character.name}. You are a member of ${character.org.name}. Your description is: ${character.description}\n` +
    character.instruction ? `Your instructions are: ${character.instruction}\n` : "";

    try {
        const response = await getAiResponse(prompt, {
            apiKey: character.org.openaiApiKey,
            context: completePrompt,
        });

        return {
            content: response,
            type: MessageType.TEXT,
        };
    } catch (error: any) {
        return {
            content: error.message,
            type: MessageType.ERROR_MESSAGE,
        }
    }
}
