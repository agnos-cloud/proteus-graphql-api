import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Mutation {
        createOrg(input: OrgInput!): Org!
    }
`;

export default typeDefs;