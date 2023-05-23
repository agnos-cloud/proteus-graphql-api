import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createUser(input: UserInput!): User!
    }
`;

export default typeDefs;