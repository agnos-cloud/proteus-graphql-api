import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        users(input: UserSearchInput): [User!]!
    }
`;

export default typeDefs;