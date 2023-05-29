"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharacterResponse = void 0;
const openai_1 = require("./openai");
async function getCharacterResponse(prompt, context) {
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
    const completePrompt = `Your name is ${character.name}. You are a member of ${character.org.name}. Your description is: ${character.description}`;
    try {
        const response = await (0, openai_1.getAiResponse)(prompt, {
            apiKey: character.org.openaiApiKey,
            context: completePrompt,
        });
        return {
            content: response,
            type: "TEXT",
        };
    }
    catch (error) {
        if (error.response) {
            return {
                content: `${error.response.data} (status: ${error.response.status})`,
                type: "ERROR_MESSAGE",
            };
        }
        else {
            return {
                content: error.message,
                type: "ERROR_MESSAGE",
            };
        }
    }
}
exports.getCharacterResponse = getCharacterResponse;
