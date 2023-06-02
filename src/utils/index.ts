import { ConversationUserPopulated } from "../graphql/conversation/types";

export function userIsConversationParticipant(users: Array<ConversationUserPopulated>, userId: string): boolean {
    return !!users.find((user) => user.userId === userId);
}

export function userIsOrgMember(members: Array<{ userId: string; }>, userId: string): boolean {
    return !!members.find((member) => member.userId === userId);
}
