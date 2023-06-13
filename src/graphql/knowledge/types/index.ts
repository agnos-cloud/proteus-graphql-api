import { Prisma } from "@prisma/client";

export type CreateKnowledgeFromTextArgs = {
    input: {
        characterId: string;
        content: string;
    }
};

export const knowledgePopulated = Prisma.validator<Prisma.KnowledgeInclude>()({
    character: {
        select: {
            id: true,
            name: true,
            orgId: true,
            org: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
});

export type KnowledgePopulated = Prisma.KnowledgeGetPayload<{
    include: typeof knowledgePopulated;
}>;

export type KnowledgeCreatedSubscriptionPayload = {
    knowledgeCreated: KnowledgePopulated;
};

export type KnowledgeDeletedSubscriptionPayload = {
    knowledgeDeleted: KnowledgePopulated;
};

export type KnowledgeUpdatedSubscriptionPayload = {
    knowledgeUpdated: KnowledgePopulated;
};

export enum KnowledgeSourceType {
    TEXT="TEXT",
    PDF_FILE="PDF_FILE",
    WEB_LINK="WEB_LINK",
}

export type SearchKnowledgeArgs = {
    input: {
        characterId: string;
    }
};
