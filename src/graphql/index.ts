import character from "./character";
import conversation from "./conversation";
import message from "./message";
import org from "./org";
import user from "./user";
import merge from "lodash.merge";

export default {
    resolvers: merge(
        {},
        character.resolvers,
        conversation.resolvers,
        message.resolvers,
        org.resolvers,
        user.resolvers,
    ),
    typeDefs: [
        ...character.typeDefs,
        ...conversation.typeDefs,
        ...message.typeDefs,
        ...org.typeDefs,
        ...user.typeDefs,
    ],
};
