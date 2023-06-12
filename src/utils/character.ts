import { CharacterMessage, ModelFamily, Plan, PrismaClient, UserMessage } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import { MessageType } from "../graphql/message/types";
import rules from "../rules";
import { getChatResponse, getResponse } from "./openai";

export type CharacterContext = {
    characterId: string;
    conversationId?: string;
    prisma: PrismaClient;
    messages?: Array<CharacterMessage>;
    userMessages?: Array<UserMessage>;
}

export type CharacterResponse = {
    content?: string;
    type?: MessageType;
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

    const contextPrompt =
    `Your name is ${character.name}. You are a member of ${character.org.name}. Your description is: ${character.description}\n` +
    character.instruction ? `Your instructions are: ${character.instruction}\n` : "";

    if (character.modelFamily === ModelFamily.OPENAI) {
        if (character.plan === Plan.BASIC || character.plan === Plan.FREE) {
            return getResponseFromOpenai(prompt, contextPrompt, { apiKey: character.org.openaiApiKey });
        } else if (character.plan === Plan.PRO) {
            return getChatResponseFromOpenai(
                (context.messages || []).slice(0, rules.maxConversationMessagesLength(Plan.PRO)),
                (context.userMessages || []).slice(0, rules.maxConversationMessagesLength(Plan.PRO)),
                contextPrompt,
                { apiKey: character.org.openaiApiKey }
            );
        } else if (character.plan === Plan.ADVANCED) {
            return getChatResponseFromOpenai(
                (context.messages || []).slice(0, rules.maxConversationMessagesLength(Plan.ADVANCED)),
                (context.userMessages || []).slice(0, rules.maxConversationMessagesLength(Plan.ADVANCED)),
                contextPrompt,
                { apiKey: character.org.openaiApiKey }
            );
        }
    }

    return {
        content: undefined,
        type: undefined,
    };
}

async function getResponseFromOpenai(prompt: string, contextPrompt: string, options: { apiKey: string; }): Promise<CharacterResponse> {
    try {
        const response = await getResponse(prompt, {
            apiKey: options.apiKey,
            context: contextPrompt,
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

async function getChatResponseFromOpenai(
    messages: Array<CharacterMessage>,
    userMessages: Array<UserMessage>,
    contextPrompt: string,
    options: { apiKey: string; }
): Promise<CharacterResponse> {
    const assistantMsgs: Array<ChatCompletionRequestMessage & { createdAt: Date }> = messages.map((message) => ({
        role: "assistant",
        content: message.content,
        name: message.senderId,
        createdAt: message.createdAt,
    }));
    const userMsgs: Array<ChatCompletionRequestMessage & { createdAt: Date }> = userMessages.map((message) => ({
        role: "user",
        content: message.content,
        name: message.senderId,
        createdAt: message.createdAt,
    }));
    const systemMsg: ChatCompletionRequestMessage = {
        role: "system",
        content: contextPrompt,
    };
    const combinedMsgs: Array<ChatCompletionRequestMessage & { createdAt: Date }> = [...assistantMsgs, ...userMsgs]
        .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return a.createdAt.getTime() - b.createdAt.getTime();
            }
            return 0;
        });
    console.log(combinedMsgs);
    const combinedMsgsWithoutDates: Array<ChatCompletionRequestMessage> = combinedMsgs
        .map((message) => ({
            role: message.role,
            content: message.content,
            name: message.name,
        }));
    try {
        const response = await getChatResponse([systemMsg, ...combinedMsgsWithoutDates], {
            apiKey: options.apiKey,
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
