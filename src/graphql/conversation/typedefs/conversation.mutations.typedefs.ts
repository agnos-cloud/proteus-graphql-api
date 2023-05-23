import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createConversation(input: ConversationInput!): Conversation!
    }
`;

export default typeDefs;