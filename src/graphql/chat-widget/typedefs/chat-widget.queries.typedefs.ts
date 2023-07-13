import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        chatWidget(id: ID!): ChatWidget
        chatWidgets(input: ChatWidgetSearchInput): [ChatWidget!]!
    }
`;

export default typeDefs;
