import { GraphQLContext } from "@types";
import { withFilter } from "graphql-subscriptions";
import {
    ChatWidgetCreatedSubscriptionPayload,
    ChatWidgetDeletedSubscriptionPayload,
    ChatWidgetUpdatedSubscriptionPayload,
    SearchChatWidgetArgs
} from "../types";

export default {
    chatWidgetCreated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHAT_WIDGET_CREATED"]);
            },
            (payload: ChatWidgetCreatedSubscriptionPayload, variables: SearchChatWidgetArgs, context: GraphQLContext) => {
                return payload.chatWidgetCreated.characterId === variables.input.characterId;
            }
        )
    },
    chatWidgetDeleted: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHAT_WIDGET_DELETED"]);
            },
            (payload: ChatWidgetDeletedSubscriptionPayload, variables: SearchChatWidgetArgs, context: GraphQLContext) => {
                return payload.chatWidgetDeleted.characterId === variables.input.characterId;
            }
        )
    },
    chatWidgetUpdated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHAT_WIDGET_UPDATED"]);
            },
            (payload: ChatWidgetUpdatedSubscriptionPayload, variables: SearchChatWidgetArgs, context: GraphQLContext) => {
                return payload.chatWidgetUpdated.characterId === variables.input.characterId;
            }
        )
    }
};
