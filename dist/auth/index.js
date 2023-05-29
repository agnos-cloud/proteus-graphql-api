"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateContext = void 0;
const graphql_1 = require("graphql");
async function authenticateContext(context) {
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
    return true;
}
exports.authenticateContext = authenticateContext;
