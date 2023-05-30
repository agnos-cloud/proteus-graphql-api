import { GraphQLContext } from "@types";
import { withFilter } from "graphql-subscriptions";
import {
    CharacterCreatedSubscriptionPayload,
    CharacterDeletedSubscriptionPayload,
    CharacterUpdatedSubscriptionPayload,
    SearchCharacterArgs,
} from "../types";

export default {
    characterCreated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHARACTER_CREATED"]);
            },
            (payload: CharacterCreatedSubscriptionPayload, variables: SearchCharacterArgs, context: GraphQLContext) => {
                return payload.characterCreated.orgId === variables.input.orgId;
            }
        )
    },
    characterDeleted: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHARACTER_DELETED"]);
            },
            (payload: CharacterDeletedSubscriptionPayload, variables: SearchCharacterArgs, context: GraphQLContext) => {
                return payload.characterDeleted.orgId === variables.input.orgId;
            }
        )
    },
    characterUpdated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHARACTER_UPDATED"]);
            },
            (payload: CharacterUpdatedSubscriptionPayload, variables: SearchCharacterArgs, context: GraphQLContext) => {
                return payload.characterUpdated.orgId === variables.input.orgId;
            }
        )
    }
};
