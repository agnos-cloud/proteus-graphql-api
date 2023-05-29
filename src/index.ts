import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import {
    ApolloServerPluginDrainHttpServer,
} from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import * as dotenv from "dotenv";
import express from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { getSession } from "next-auth/react";
import { WebSocketServer } from "ws";
import graphql from "./graphql";
import { GraphQLContext, SubscriptionContext } from "@types";
import cors from "cors";
import { json } from "body-parser";

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

    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        csrfPrevention: false,
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
        ],
    });

    await server.start();

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    };
    app.use(
        "/graphql",
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server, {
            context: async ({ req }): Promise<GraphQLContext> => {
                const session = await getSession({ req });
                return { pubsub, prisma, session };
            },
        })
    );

    const port = process.env.PORT || 3000;

    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}

main().catch((err) => console.log(err));
