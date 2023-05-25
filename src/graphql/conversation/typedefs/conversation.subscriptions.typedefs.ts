import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        conversationCreated(input: ConversationSearchInput): Conversation
        conversationUpdated(input: ConversationSearchInput): Conversation
    }
`;

export default typeDefs;