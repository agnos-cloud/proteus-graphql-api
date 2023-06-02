import { Prisma } from "@prisma/client";

export const conversationCharacterPopulated = Prisma.validator<Prisma.ConversationCharacterInclude>()({
    character: {
        select: {
            id: true,
            name: true,
        },
    },
});

export const conversationUserPopulated = Prisma.validator<Prisma.ConversationUserInclude>()({
    user: {
        select: {
            id: true,
            name: true,
        },
    },
});

export type ConversationUserPopulated = Prisma.ConversationUserGetPayload<{
    include: typeof conversationUserPopulated;
}>;

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
    characters: {
        include: conversationCharacterPopulated,
    },
    org: {
        select: {
            id: true,
            name: true,
        },
    },
    users: {
        include: conversationUserPopulated,
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
});

export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated;
}>;

export type ConversationCharacterPopulated = Prisma.ConversationCharacterGetPayload<{
    include: typeof conversationCharacterPopulated;
}>;

export type ConversationCreatedSubscriptionPayload = {
    conversationCreated: ConversationPopulated;
};

export type ConversationDeletedSubscriptionPayload = {
    conversationDeleted: ConversationPopulated;
};

export type ConversationUpdatedSubscriptionPayload = {
    conversationUpdated: ConversationPopulated;
};

export type CreateConversationArgs = {
    input: {
        characterIds: Array<string>;
        orgId: string;
    }
};

export type SearchConversationArgs = {
    input: {
        characterIds?: Array<string>;
        orgId: string;
    }
};