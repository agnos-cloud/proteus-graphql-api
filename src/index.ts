import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { getSession } from "next-auth/react";
import graphql from "./graphql";
import { GraphQLContext } from "./utils/types";

async function main() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({
        typeDefs: graphql.typeDefs,
        resolvers: graphql.resolvers,
    });

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    };

    const prisma = new PrismaClient();

    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        csrfPrevention: false,
        cache: "bounded",
        context: async ({ req, res }): Promise<GraphQLContext> => {
            const session = await getSession({ req });
            return { prisma, session };
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
            ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    "request.credentials": "include",
                }
            }),
        ],
    });

    await server.start();

    server.applyMiddleware({ app, cors: corsOptions });

    await new Promise<void>((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:3000${server.graphqlPath}`
    );
}

main().catch((err) => console.log(err));
