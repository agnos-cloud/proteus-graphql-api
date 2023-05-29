import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        orgCreated: Org
        orgDeleted: Org
        orgUpdated: Org
    }
`;

export default typeDefs;