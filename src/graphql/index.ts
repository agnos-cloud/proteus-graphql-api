import character from "./character";
import conversation from "./conversation";
import org from "./org";
import merge from "lodash.merge";

export default {
    resolvers: merge(
        {},
        character.resolvers,
        conversation.resolvers,
        org.resolvers
    ),
    typeDefs: [
        ...character.typeDefs,
        ...conversation.typeDefs,
        ...org.typeDefs,
    ],
};
