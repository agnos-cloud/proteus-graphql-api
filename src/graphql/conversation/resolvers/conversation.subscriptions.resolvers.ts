import { withFilter } from "graphql-subscriptions";
import { GraphQLContext } from "../../../utils/types";
import { userIsConversationParticipant } from "../../../utils/functions";

export default {
    conversationCreated: {
        // subscribe: (_: any, __: any, { pubsub }: GraphQLContext) => {
        //     return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        // }
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
            },
            (payload, variables, context: GraphQLContext) => {
                return payload.conversationCreated.org.id === variables.input.org &&
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
            (payload, variables, context: GraphQLContext) => {
                return payload.conversationDeleted.org.id === variables.input.org; // &&
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
            (payload, variables, context: GraphQLContext) => {
                return payload.conversationUpdated.org.id === variables.input.org &&
                    // payload.conversationUpdated.users.some((user: any) => user.userId === context.session?.user?.id);
                    userIsConversationParticipant(payload.conversationUpdated.users, context.session?.user?.id);
            }
        )
    }
};
