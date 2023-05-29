import { GraphQLError } from "graphql";
import { GraphQLContext } from"@types";
import { Character } from "../model/character.model";

export default {
    createCharacter: async (_: any, args: any, context: GraphQLContext): Promise<Character> => {
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

        const { name, description, org } = args.input;
        const character = await prisma.character.create({
            data: {
                name,
                description,
                org: {
                    connect: {
                        id: org,
                    },
                },
            },
        });

        return character;
    }
};
