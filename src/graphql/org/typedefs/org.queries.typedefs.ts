import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        org(id: ID!): Org
        orgs: [Org!]!
    }
`;

export default typeDefs;