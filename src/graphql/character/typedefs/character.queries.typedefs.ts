import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        characters(input: CharacterSearchInput): [Character!]!
    }
`;

export default typeDefs;