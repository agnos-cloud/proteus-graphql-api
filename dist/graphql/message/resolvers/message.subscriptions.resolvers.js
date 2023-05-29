"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.default = {
    characterMessageSent: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["CHARACTER_MESSAGE_SENT"]);
        }, (payload, variables, context) => {
            return payload.characterMessageSent.conversationId === variables.input.conversation;
        })
    },
    userMessageSent: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["USER_MESSAGE_SENT"]);
        }, (payload, variables, context) => {
            return payload.userMessageSent.conversationId === variables.input.conversation;
        })
    }
};
