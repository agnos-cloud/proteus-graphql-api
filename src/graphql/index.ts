import character from "./character";
import chatWidget from "./chat-widget";
import conversation from "./conversation";
import knowledge from "./knowledge";
import message from "./message";
import org from "./org";
import user from "./user";
import scalarResolvers from "./scalar";
import merge from "lodash.merge";

export default {
    resolvers: merge(
        {},
        character.resolvers,
        chatWidget.resolvers,
        conversation.resolvers,
        knowledge.resolvers,
        message.resolvers,
        org.resolvers,
        scalarResolvers,
    ),
    typeDefs: [
        ...character.typeDefs,
        ...chatWidget.typeDefs,
        ...conversation.typeDefs,
        ...knowledge.typeDefs,
        ...message.typeDefs,
        ...org.typeDefs,
        ...user.typeDefs,
    ],
};
