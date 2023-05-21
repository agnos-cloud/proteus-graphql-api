import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Mutation {
        createConversation(input: ConversationInput!): Conversation!
    }
`;

export default typeDefs;