import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        characterCreated(input: CharacterSearchInput): Character
        characterDeleted(input: CharacterSearchInput): Character
        characterUpdated(input: CharacterSearchInput): Character
    }
`;

export default typeDefs;
