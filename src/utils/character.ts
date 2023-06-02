import { Character, PrismaClient } from "@prisma/client";
import { getAiResponse } from "./openai";

export type CharacterContext = {
    characterId: string;
    prisma: PrismaClient;
}

export type CharacterResponse = {
    content: string;
    type: ContentType;
}

export type ContentType = "TEXT" | "ERROR_MESSAGE";

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
            type: "TEXT",
        };
    } catch (error: any) {
        if (error.response) {
            return {
                content: `${error.response.data} (status: ${error.response.status})`,
                type: "ERROR_MESSAGE",
            }
        } else {
            return {
                content: error.message,
                type: "ERROR_MESSAGE",
            }
        }
    }
}
