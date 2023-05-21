import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type Org {
        id: ID!
        name: String!
        description: String
        openaiApiKey: String
    }

    input OrgInput {
        name: String!
        description: String
    }
`;

export default typeDefs;