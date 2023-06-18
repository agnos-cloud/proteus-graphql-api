import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createConversation(input: ConversationInput!): Conversation!
        deleteConversation(id: ID!): Boolean
        markConversationAsRead(id: ID!): Boolean
        setConversationState(input: ConversationStateInput!): Boolean
    }
`;

export default typeDefs;
