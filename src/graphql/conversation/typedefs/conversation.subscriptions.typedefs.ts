import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        conversationCreated(input: ConversationSearchInput): Conversation
    }
`;

export default typeDefs;