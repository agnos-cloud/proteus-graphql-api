"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsOrgMember = exports.userIsConversationParticipant = void 0;
function userIsConversationParticipant(users, userId) {
    return !!users.find((user) => user.userId === userId);
}
exports.userIsConversationParticipant = userIsConversationParticipant;
function userIsOrgMember(members, userId) {
    return !!members.find((member) => member.userId === userId);
}
exports.userIsOrgMember = userIsOrgMember;
