"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.default = {
    createCharacter: async (_, args, context) => {
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
