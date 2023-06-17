import gql from "graphql-tag";

export const typeDefs = gql`
    type Mutation {
        createChatWidget(input: ChatWidgetInput!): ChatWidget!
    }
`;

export default typeDefs;