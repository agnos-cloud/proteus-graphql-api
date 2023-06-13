import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createKnowledgeFromText(input: KnowledgeFromTextInput!): Knowledge!
    }
`;

export default typeDefs;
