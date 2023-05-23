import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../../utils/types";
import { User } from "../model/user.model";

export default {
    createUser: async (_: any, args: any, context: GraphQLContext): Promise<User> => {
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
