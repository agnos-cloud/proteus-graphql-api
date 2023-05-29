"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const conversation_mutations_resolvers_1 = require("./conversation.mutations.resolvers");
exports.default = {
    conversations: async (_, args, context) => {
        const { prisma, session } = context;
        if (!session?.user?.id) {
            throw new graphql_1.GraphQLError("You must be authenticated");
        }
        const { id } = session.user;
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new graphql_1.GraphQLError("You must be authenticated");
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
            orderBy: {
                updatedAt: "desc",
            },
            include: conversation_mutations_resolvers_1.conversationPopulated,
        });
        return conversations;
    }
};
