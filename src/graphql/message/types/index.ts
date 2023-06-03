import { Prisma } from "@prisma/client";

export const characterMessagePopulated = Prisma.validator<Prisma.CharacterMessageInclude>()({
    sender: {
        select: {
            id: true,
            name: true,
            image: true,
        },
    },
});

export type CharacterMessagePopulated = Prisma.CharacterMessageGetPayload<{
    include: typeof characterMessagePopulated;
}>;

export interface CharacterMessageSentPayload {
    characterMessageSent: CharacterMessagePopulated;
}

export const userMessagePopulated = Prisma.validator<Prisma.UserMessageInclude>()({
    sender: {
        select: {
            id: true,
            name: true,
            image: true,
        },
    },
});

export type UserMessagePopulated = Prisma.UserMessageGetPayload<{
    include: typeof userMessagePopulated;
}>;

export interface UserMessageSentPayload {
    userMessageSent: UserMessagePopulated;
}

export type SearchMessageArgs = {
    input: {
        conversationId: string;
    }
};

export type SendMessageArgs = {
    input: {
        id?: string;
        content?: string
        conversationId: string;
        senderId: string;
        type?: MessageType;
    }
};

export enum MessageType {
    TEXT="TEXT",
    ERROR_MESSAGE="ERROR_MESSAGE",
}
