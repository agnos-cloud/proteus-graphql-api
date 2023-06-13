import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        knowledgeCreated(input: KnowledgeSearchInput): Knowledge
        knowledgeDeleted(input: KnowledgeSearchInput): Knowledge
        knowledgeUpdated(input: KnowledgeSearchInput): Knowledge
    }
`;

export default typeDefs;
