import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        characterMessages(input: MessageSearchInput): [CharacterMessage!]!
        userMessages(input: MessageSearchInput): [UserMessage!]!
    }
`;

export default typeDefs;