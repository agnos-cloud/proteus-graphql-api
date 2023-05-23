import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        users(input: UserSearchInput): [User!]!
    }
`;

export default typeDefs;