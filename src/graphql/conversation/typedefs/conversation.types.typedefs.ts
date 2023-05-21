import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Conversation {
        id: ID!
    }

    input ConversationInput {
        characters: [ID!]!
        org: ID!
    }
`;

export default typeDefs;