import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Mutation {
        createUser(input: UserInput!): User!
    }
`;

export default typeDefs;