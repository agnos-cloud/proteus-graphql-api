import { GraphQLContext } from "@types";
import { withFilter } from "graphql-subscriptions";
import { CharacterMessageSentPayload, SearchMessageArgs, UserMessageSentPayload } from "../types";

export default {
    characterMessageSent: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHARACTER_MESSAGE_SENT"]);
            },
            (payload: CharacterMessageSentPayload, variables: SearchMessageArgs, context: GraphQLContext) => {
                return payload.characterMessageSent.conversationId === variables.input.conversationId;
            }
        )
    },
    userMessageSent: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["USER_MESSAGE_SENT"]);
            },
            (payload: UserMessageSentPayload, variables: SearchMessageArgs, context: GraphQLContext) => {
                return payload.userMessageSent.conversationId === variables.input.conversationId;
            }
        )
    }
};

