import gql from "graphql-tag";

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

    input OrgSearchInput {
        id: String!
    }
`;

export default typeDefs;