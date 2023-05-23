import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        messages(input: CharacterMessageSearchInput): [CharacterMessage!]!
    }
`;

export default typeDefs;