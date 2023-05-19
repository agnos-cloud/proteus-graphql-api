import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Org {
        id: ID!
        name: String!
        description: String
    }

    type OrgInput {
        name: String!
        description: String
    }

    type CreateOrgResponse {
        data: Org
    }
`;

export default typeDefs;