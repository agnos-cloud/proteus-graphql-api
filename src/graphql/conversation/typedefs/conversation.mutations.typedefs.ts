import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createConversation(input: ConversationInput!): Conversation!
        markConversationAsRead(id: ID!): Boolean
    }
`;

export default typeDefs;