import character from "./character";
import conversation from "./conversation";
import message from "./message";
import org from "./org";
import user from "./user";
import scalarResolvers from "./scalar";
import merge from "lodash.merge";

export default {
    resolvers: merge(
        {},
        character.resolvers,
        conversation.resolvers,
        message.resolvers,
        org.resolvers,
        scalarResolvers,
    ),
    typeDefs: [
        ...character.typeDefs,
        ...conversation.typeDefs,
        ...message.typeDefs,
        ...org.typeDefs,
        ...user.typeDefs,
    ],
};
