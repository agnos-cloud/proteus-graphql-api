import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";
import graphql from "./graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function main() {
    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({
        typeDefs: graphql.typeDefs,
        resolvers: graphql.resolvers,
    });

    const server = new ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        csrfPrevention: false,
        cache: "bounded",
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    });

    await server.start();

    server.applyMiddleware({ app });

    await new Promise<void>((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:3000${server.graphqlPath}`
    );
}

main().catch((err) => console.log(err));
