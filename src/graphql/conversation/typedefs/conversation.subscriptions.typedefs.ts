import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Subscription {
        conversationCreated(input: ConversationSearchInput): Conversation
    }
`;

export default typeDefs;