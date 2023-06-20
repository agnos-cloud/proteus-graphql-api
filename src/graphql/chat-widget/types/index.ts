import { Prisma } from "@prisma/client";

export const chatWidgetPopulated = Prisma.validator<Prisma.ChatWidgetInclude>()({
    character: {
        select: {
            id: true,
            name: true,
            description: true,
            image: true,
        },
    },
});

export type ChatWidgetPopulated = Prisma.ChatWidgetGetPayload<{
    include: typeof chatWidgetPopulated;
}>;

export type ChatWidgetCreatedSubscriptionPayload = {
    chatWidgetCreated: ChatWidgetPopulated;
};

export type ChatWidgetDeletedSubscriptionPayload = {
    chatWidgetDeleted: ChatWidgetPopulated;
};

export type ChatWidgetUpdatedSubscriptionPayload = {
    chatWidgetUpdated: ChatWidgetPopulated;
};

export type CreateChatWidgetArgs = {
    input: {
        name?: string;
        characterId: string;
        description?: string;
        origins?: string[];
        primaryColor?: string;
        secondaryColor?: string;
        tertiaryColor?: string;
    }
};

export type GetChatWidgetArgs = {
    id: string;
};

export type SearchChatWidgetArgs = {
    input: {
        characterId: string;
    }
};
