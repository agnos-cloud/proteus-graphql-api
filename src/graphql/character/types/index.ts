import { Prisma } from "@prisma/client";

export const characterPopulated = Prisma.validator<Prisma.CharacterInclude>()({
    org: {
        select: {
            id: true,
            name: true,
            description: true,
        },
    },
});

export type CharacterPopulated = Prisma.CharacterGetPayload<{
    include: typeof characterPopulated;
}>;

export type CharacterCreatedSubscriptionPayload = {
    characterCreated: CharacterPopulated;
};

export type CharacterDeletedSubscriptionPayload = {
    characterDeleted: CharacterPopulated;
};

export type CharacterUpdatedSubscriptionPayload = {
    characterUpdated: CharacterPopulated;
};

export type CreateCharacterArgs = {
    input: {
        name: string;
        description?: string;
        orgId: string;
    }
};

export type GetCharacterArgs = {
    id: string;
};

export type SaveCharacterInstructionArgs = {
    input: {
        id: string;
        instruction: string;
        orgId: string;
    }
};

export type SearchCharacterArgs = {
    input: {
        name?: string;
        orgId: string;
    }
};
