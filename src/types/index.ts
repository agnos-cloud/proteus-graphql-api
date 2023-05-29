import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
    prisma: PrismaClient;
    session: Session | null;
    pubsub: PubSub;
}

export interface Session {
    user?: User;
    expires: ISODateString;
}

export interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: ISODateString | null;
    image?: string | null;
}

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session;
    }
}
