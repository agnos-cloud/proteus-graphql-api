import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        orgs: [Org!]!
    }
`;

export default typeDefs;