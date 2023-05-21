import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../../utils/types";
import { Conversation } from "../model/conversation.model";

export default {
    characters: async (_: any, args: any, context: GraphQLContext): Promise<Array<Conversation>> => {
        console.log(args);

        const { prisma, session } = context;

        if (!session?.user?.id) {
            throw new ApolloError("You must be authenticated");
        }

       const { id } = session.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new ApolloError("You must be authenticated");
        }

        const { name, org } = args.input;

        const characters = await prisma.character.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
                org: {
                    id: org,
                },
            },
        });

        return characters;
    }
};
