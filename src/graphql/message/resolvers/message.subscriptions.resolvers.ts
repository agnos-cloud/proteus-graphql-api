import { withFilter } from "graphql-subscriptions";
import { GraphQLContext } from "../../../utils/types";
import { Prisma } from "@prisma/client";
import { characterMessagePopulated, userMessagePopulated } from "./message.mutations.resolvers";

export default {
    characterMessageSent: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["CHARACTER_MESSAGE_SENT"]);
            },
            (payload: CharacterMessageSentPayload, variables, context: GraphQLContext) => {
                return payload.characterMessageSent.conversationId === variables.input.conversation;
            }
        )
    },
    userMessageSent: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["USER_MESSAGE_SENT"]);
            },
            (payload: UserMessageSentPayload, variables, context: GraphQLContext) => {
                return payload.userMessageSent.conversationId === variables.input.conversation;
            }
        )
    }
};

export interface CharacterMessageSentPayload {
    characterMessageSent: CharacterMessagePopulated;
}

export type CharacterMessagePopulated = Prisma.CharacterMessageGetPayload<{
    include: typeof characterMessagePopulated,
}>;

export interface UserMessageSentPayload {
    userMessageSent: UserMessagePopulated;
}

export type UserMessagePopulated = Prisma.UserMessageGetPayload<{
    include: typeof userMessagePopulated,
}>;
