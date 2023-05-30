import { Prisma } from "@prisma/client";

export const orgPopulated = Prisma.validator<Prisma.OrgInclude>()({
    members: {
        select: {
            role: true,
            userId: true,
        },
    },
});

export type OrgPopulated = Prisma.OrgGetPayload<{
    include: typeof orgPopulated;
}>;

export type OrgCreatedSubscriptionPayload = {
    orgCreated: OrgPopulated;
};

export type OrgDeletedSubscriptionPayload = {
    orgDeleted: OrgPopulated;
};

export type OrgUpdatedSubscriptionPayload = {
    orgUpdated: OrgPopulated;
};

export type CreateOrgArgs = {
    input: {
        name: string;
        description?: string;
    }
};
