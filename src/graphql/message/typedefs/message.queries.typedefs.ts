import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        messages(input: CharacterMessageSearchInput): [CharacterMessage!]!
    }
`;

export default typeDefs;