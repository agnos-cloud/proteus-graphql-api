import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createMessage(input: CharacterMessageInput!): CharacterMessage!
    }
`;

export default typeDefs;