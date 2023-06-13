import gql from "graphql-tag";

export const typeDefs = gql`
    type Knowledge {
        id: ID!
        character: Character!
        characterId: ID!
        createdAt: Date!
        description: String
        embeddings: [String!]!
        name: String!
        source: String!
        sourceType: KnowledgeSourceType!
        updatedAt: Date!
    }

    enum KnowledgeSourceType {
        TEXT
        PDF_FILE
        WEB_LINK
    }

    input KnowledgeFromTextInput {
        characterId: ID!
        content: String!
    }

    input KnowledgeSearchInput {
        characterId: ID!
    }
`;

export default typeDefs;