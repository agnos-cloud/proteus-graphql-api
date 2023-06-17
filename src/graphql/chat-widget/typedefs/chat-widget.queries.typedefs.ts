import gql from "graphql-tag";

export const typeDefs = gql`
    type Query {
        chatWidgets(input: ChatWidgetSearchInput): [ChatWidget!]!
    }
`;

export default typeDefs;
