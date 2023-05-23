import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        conversation(input: ConversationSearchInput): Conversation!
        conversations(input: ConversationSearchInput): [Conversation!]!
    }
`;

export default typeDefs;