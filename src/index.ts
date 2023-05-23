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
import { GraphQLContext, SubscriptionContext } from "./utils/types";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { PubSub } from "graphql-subscriptions";

async function main() {
    dotenv.config();
    const app = express();
    const httpServer = http.createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql/subscriptions",
    });

    const schema = makeExecutableSchema({
        typeDefs: graphql.typeDefs,
        resolvers: graphql.resolvers,
    });

    const prisma = new PrismaClient();
    const pubsub = new PubSub();

    const serverCleanup = useServer({ schema, context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams.session) {
            const { session } = ctx.connectionParams;
            return { pubsub, prisma, session };
        }
        return { pubsub, prisma, session: null };
    } }, wsServer);

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    };

    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        csrfPrevention: false,
        cache: "bounded",
        context: async ({ req, res }): Promise<GraphQLContext> => {
            const session = await getSession({ req });
            return { pubsub, prisma, session };
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            // httpServer.close();
                            await serverCleanup.dispose();
                        },
                    };
                }
            },
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
