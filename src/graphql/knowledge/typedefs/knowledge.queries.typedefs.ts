import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        knowledges(input: KnowledgeSearchInput): [Knowledge!]!
    }
`;

export default typeDefs;
