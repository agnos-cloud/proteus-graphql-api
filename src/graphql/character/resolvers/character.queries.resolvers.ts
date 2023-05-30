import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CharacterPopulated, SearchCharacterArgs, characterPopulated } from "../types";

export default {
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
