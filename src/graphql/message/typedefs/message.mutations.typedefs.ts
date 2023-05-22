import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Mutation {
        createMessage(input: CharacterMessageInput!): CharacterMessage!
    }
`;

export default typeDefs;