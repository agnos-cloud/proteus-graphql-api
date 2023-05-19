import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Query {
        orgs: [Org!]!
    }
`;

export default typeDefs;