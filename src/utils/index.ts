import { UserPopulated } from "../graphql/conversation/resolvers/conversation.mutations.resolvers";

export function userIsConversationParticipant(users: Array<UserPopulated>, userId: string): boolean {
    return !!users.find((user) => user.userId === userId);
}

export function userIsOrgMember(members: Array<{ userId: string; }>, userId: string): boolean {
    return !!members.find((member) => member.userId === userId);
}
