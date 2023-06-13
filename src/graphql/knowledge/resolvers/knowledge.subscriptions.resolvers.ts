import { withFilter } from "graphql-subscriptions";
import { GraphQLContext } from "@types";
import {
    KnowledgeCreatedSubscriptionPayload,
    KnowledgeDeletedSubscriptionPayload,
    KnowledgeUpdatedSubscriptionPayload,
    SearchKnowledgeArgs
} from "../types";

export default {
    knowledgeCreated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["KNOWLEDGE_CREATED"]);
            },
            (payload: KnowledgeCreatedSubscriptionPayload, variables: SearchKnowledgeArgs, context: GraphQLContext) => {
                return payload.knowledgeCreated.characterId === variables.input.characterId;
            }
        )
    },
    knowledgeDeleted: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["KNOWLEDGE_DELETED"]);
            },
            (payload: KnowledgeDeletedSubscriptionPayload, variables: SearchKnowledgeArgs, context: GraphQLContext) => {
                return payload.knowledgeDeleted.characterId === variables.input.characterId;
            }
        )
    },
    knowledgeUpdated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["KNOWLEDGE_UPDATED"]);
            },
            (payload: KnowledgeUpdatedSubscriptionPayload, variables: SearchKnowledgeArgs, context: GraphQLContext) => {
                return payload.knowledgeUpdated.characterId === variables.input.characterId;
            }
        )
    }
};
