import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        chatWidgetCreated(input: ChatWidgetSearchInput): ChatWidget
        chatWidgetDeleted(input: ChatWidgetSearchInput): ChatWidget
        chatWidgetUpdated(input: ChatWidgetSearchInput): ChatWidget
    }
`;

export default typeDefs;
