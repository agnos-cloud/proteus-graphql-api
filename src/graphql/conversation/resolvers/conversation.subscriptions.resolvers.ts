import { withFilter } from "graphql-subscriptions";
import { GraphQLContext } from "@types";
import { userIsConversationParticipant } from "../../../utils";
import { ConversationCreatedSubscriptionPayload, ConversationDeletedSubscriptionPayload, ConversationUpdatedSubscriptionPayload, SearchConversationArgs } from "../types";

export default {
    conversationCreated: {
        // subscribe: (_: any, __: any, { pubsub }: GraphQLContext) => {
        //     return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        // }
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
            },
            (payload: ConversationCreatedSubscriptionPayload, variables: SearchConversationArgs, context: GraphQLContext) => {
                return payload.conversationCreated.orgId === variables.input.orgId &&
                    // payload.conversationCreated.users.some((user: any) => user.userId === context.session?.user?.id);
                    userIsConversationParticipant(payload.conversationCreated.users, context.session?.user?.id);
            }
        )
    },
    conversationDeleted: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CONVERSATION_DELETED"]);
            },
            (payload: ConversationDeletedSubscriptionPayload, variables: SearchConversationArgs, context: GraphQLContext) => {
                return payload.conversationDeleted.orgId === variables.input.orgId; // &&
                    // payload.conversationDeleted.users.some((user: any) => user.userId === context.session?.user?.id);
                    // userIsConversationParticipant(payload.conversationDeleted.users, context.session?.user?.id);
            }
        )
    },
    conversationUpdated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
            },
            (payload: ConversationUpdatedSubscriptionPayload, variables: SearchConversationArgs, context: GraphQLContext) => {
                return payload.conversationUpdated.orgId === variables.input.orgId &&
                    // payload.conversationUpdated.users.some((user: any) => user.userId === context.session?.user?.id);
                    userIsConversationParticipant(payload.conversationUpdated.users, context.session?.user?.id);
            }
        )
    }
};
