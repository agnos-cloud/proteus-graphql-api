import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
    prisma: PrismaClient;
    session: Session | null;
}

export interface Session {
    user?: User;
    expires: ISODateString;
}

export interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    image?: string | null;
}
