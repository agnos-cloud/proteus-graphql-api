import gql from "graphql-tag";

export const typeDefs = gql`
    type Membership {
        id: ID!
        orgId: String!
        role: Role
        userId: String!
    }

    enum Role {
        GUEST
        MEMBER
        OWNER
    }

    type Org {
        id: ID!
        name: String!
        description: String
        members: [Membership!]!
        createdAt: Date
        updatedAt: Date
    }

    input CreateOrgInput {
        name: String!
        description: String
    }
`;

export default typeDefs;