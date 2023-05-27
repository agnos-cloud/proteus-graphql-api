import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../../utils/types";
import { Character } from "../model/character.model";

export default {
    characters: async (_: any, args: any, context: GraphQLContext): Promise<Array<Character>> => {
        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new GraphQLError("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new GraphQLError("You must be authenticated");
        }

        const { name, org } = args.input;

        const characters = await prisma.character.findMany({
            where: {
                ...(name && {name: {
                    contains: name,
                    mode: "insensitive",
                }}),
                org: {
                    id: org,
                },
            },
        });

        return characters;
    }
};
