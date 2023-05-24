import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        sendCharacterMessage(input: MessageInput!): Boolean
        sendUserMessage(input: MessageInput!): Boolean
    }
`;

export default typeDefs;