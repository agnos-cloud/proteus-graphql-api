import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CharacterPopulated, GetCharacterArgs, SearchCharacterArgs, characterPopulated } from "../types";
import { GraphQLError } from "graphql";
import { orgPopulated } from "../../../graphql/org/types";

export default {
    character: async (_: any, args: GetCharacterArgs, context: GraphQLContext): Promise<CharacterPopulated> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { id } = args;

        const character = await prisma.character.findUnique({
            where: {
                id,
            },
            include: characterPopulated,
        });

        if (!character) {
            throw new GraphQLError("Character not found");
        }

        const org = await prisma.org.findUnique({
            where: {
                id: character.orgId,
            },
            include: orgPopulated,
        });

        if (org.members.findIndex((member) => member.userId === session?.user?.id) === -1) {
            throw new GraphQLError("Character not found");
        }

        return character;
    },
    characters: async (_: any, args: SearchCharacterArgs, context: GraphQLContext): Promise<Array<CharacterPopulated>> => {
        const { prisma, session } = context;

        await authenticateContext(context);

        const { name, orgId } = args.input;

        const characters = await prisma.character.findMany({
            where: {
                ...(name && {name: {
                    contains: name,
                    mode: "insensitive",
                }}),
                org: {
                    id: orgId,
                },
            },
            include: characterPopulated,
            orderBy: {
                updatedAt: "desc",
            },
        });

        return characters;
    }
};
