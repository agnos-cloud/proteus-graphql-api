import gql from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    type ChatWidget {
        id: ID!
        character: Character
        characterId: ID
        createdAt: Date
        description: String
        logo: String
        name: String
        origins: [String]
        primaryColor: String
        secondaryColor: String
        tertiaryColor: String
        updatedAt: Date
    }

    input ChatWidgetInput {
        name: String
        characterId: ID!
        description: String
        origins: [String]
        primaryColor: String
        secondaryColor: String
        tertiaryColor: String
    }

    input ChatWidgetSearchInput {
        characterId: ID!
    }
`;

export default typeDefs;
