import { GraphQLContext } from "@types";
// import { userIsOrgMember } from "@utils";
import { userIsOrgMember } from "../../../utils";
import { withFilter } from "graphql-subscriptions";
import { OrgCreatedSubscriptionPayload, OrgDeletedSubscriptionPayload, OrgUpdatedSubscriptionPayload } from "../types";

export default {
    orgCreated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["ORG_CREATED"]);
            },
            (payload: OrgCreatedSubscriptionPayload, variables, context: GraphQLContext) => {
                return userIsOrgMember(payload.orgCreated.members, context.session?.user?.id);
            }
        )
    },
    orgDeleted: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["ORG_DELETED"]);
            },
            (payload: OrgDeletedSubscriptionPayload, variables, context: GraphQLContext) => {
                return userIsOrgMember(payload.orgDeleted.members, context.session?.user?.id);
            }
        )
    },
    orgUpdated: {
        subscribe: withFilter(
            (_: any, __: any, { pubsub }: GraphQLContext) => {
                return pubsub.asyncIterator(["ORG_UPDATED"]);
            },
            (payload: OrgUpdatedSubscriptionPayload, variables, context: GraphQLContext) => {
                return userIsOrgMember(payload.orgUpdated.members, context.session?.user?.id);
            }
        )
    }
};
