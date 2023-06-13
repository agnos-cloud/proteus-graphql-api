import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createConversation(input: ConversationInput!): Conversation!
        deleteConversation(id: ID!): Boolean
        markConversationAsRead(id: ID!): Boolean
    }
`;

export default typeDefs;
