import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../../utils/types";
import { Message } from "../model/message.model";

export default {
    messages: async (_: any, args: any, context: GraphQLContext): Promise<Array<Message>> => {
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

        const { characters, org } = args.input;

        const charactersd = await prisma.conversation.findMany({
            where: {
                org: {
                    id: org,
                },
            },
        });

        return [];
    }
};
