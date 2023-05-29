"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const utils_1 = require("../../../utils");
exports.default = {
    conversationCreated: {
        // subscribe: (_: any, __: any, { pubsub }: GraphQLContext) => {
        //     return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        // }
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        }, (payload, variables, context) => {
            return payload.conversationCreated.org.id === variables.input.org &&
                // payload.conversationCreated.users.some((user: any) => user.userId === context.session?.user?.id);
                (0, utils_1.userIsConversationParticipant)(payload.conversationCreated.users, context.session?.user?.id);
        })
    },
    conversationDeleted: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
        }, (payload, variables, context) => {
            return payload.conversationDeleted.org.id === variables.input.org; // &&
            // payload.conversationDeleted.users.some((user: any) => user.userId === context.session?.user?.id);
            // userIsConversationParticipant(payload.conversationDeleted.users, context.session?.user?.id);
        })
    },
    conversationUpdated: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        }, (payload, variables, context) => {
            return payload.conversationUpdated.org.id === variables.input.org &&
                // payload.conversationUpdated.users.some((user: any) => user.userId === context.session?.user?.id);
                (0, utils_1.userIsConversationParticipant)(payload.conversationUpdated.users, context.session?.user?.id);
        })
    }
};
