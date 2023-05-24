import gql from "graphql-tag";

export const typeDefs = gql`
    type Subscription {
        characterMessageSent(input: MessageSearchInput): CharacterMessage
        userMessageSent(input: MessageSearchInput): UserMessage
    }
`;

export default typeDefs;