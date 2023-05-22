import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        conversations(input: ConversationSearchInput): [Conversation!]!
    }
`;

export default typeDefs;