import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createOrg(input: OrgInput!): Org!
    }
`;

export default typeDefs;