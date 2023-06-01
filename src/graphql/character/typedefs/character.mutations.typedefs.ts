import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createCharacter(input: CharacterInput!): Character!
        saveInstruction(input: SaveCharacterInstructionInput!): Boolean
    }
`;

export default typeDefs;