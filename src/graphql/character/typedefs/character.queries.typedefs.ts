import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        characters(input: CharacterSearchInput): [Character!]!
    }
`;

export default typeDefs;