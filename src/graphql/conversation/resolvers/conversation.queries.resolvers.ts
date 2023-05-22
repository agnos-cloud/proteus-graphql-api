import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../../utils/types";
import { Conversation } from "../model/conversation.model";
import { ConversationPopulated, conversationPopulated } from "./conversation.mutations.resolvers";

export default {
    conversations: async (_: any, args: any, context: GraphQLContext): Promise<Array<ConversationPopulated>> => {
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

        const { org } = args.input;

        const conversations = await prisma.conversation.findMany({
            where: {
                users: {
                    some: {
                        userId: {
                            equals: id,
                        },
                    },
                },
                org: {
                    id: org,
                },
            },
            include: conversationPopulated,
        });

        return conversations;
    }
};
