import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Mutation {
        createCharacter(input: CharacterInput!): Character!
    }
`;

export default typeDefs;