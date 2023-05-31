import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        character(id: ID!): Character
        characters(input: CharacterSearchInput): [Character!]!
    }
`;

export default typeDefs;