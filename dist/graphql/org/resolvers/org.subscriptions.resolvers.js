"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _utils_1 = require("@utils");
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.default = {
    orgCreated: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["ORG_CREATED"]);
        }, (payload, variables, context) => {
            return (0, _utils_1.userIsOrgMember)(payload.orgCreated.members, context.session?.user?.id);
        })
    },
    orgDeleted: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["ORG_DELETED"]);
        }, (payload, variables, context) => {
            return (0, _utils_1.userIsOrgMember)(payload.orgDeleted.members, context.session?.user?.id);
        })
    },
    orgUpdated: {
        subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, { pubsub }) => {
            return pubsub.asyncIterator(["ORG_UPDATED"]);
        }, (payload, variables, context) => {
            return (0, _utils_1.userIsOrgMember)(payload.orgUpdated.members, context.session?.user?.id);
        })
    }
};
