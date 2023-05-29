import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        conversations(input: ConversationSearchInput): [Conversation!]!
    }
`;

export default typeDefs;