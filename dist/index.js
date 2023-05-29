"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const client_1 = require("@prisma/client");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const ws_1 = require("graphql-ws/lib/use/ws");
const http_1 = __importDefault(require("http"));
const react_1 = require("next-auth/react");
const ws_2 = require("ws");
const graphql_1 = __importDefault(require("./graphql"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
async function main() {
    dotenv.config();
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const wsServer = new ws_2.WebSocketServer({
        server: httpServer,
        path: "/graphql/subscriptions",
    });
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: graphql_1.default.typeDefs,
        resolvers: graphql_1.default.resolvers,
    });
    const prisma = new client_1.PrismaClient();
    const pubsub = new graphql_subscriptions_1.PubSub();
    const serverCleanup = (0, ws_1.useServer)({ schema, context: async (ctx) => {
            if (ctx.connectionParams.session) {
                const { session } = ctx.connectionParams;
                return { pubsub, prisma, session };
            }
            return { pubsub, prisma, session: null };
        } }, wsServer);
    const server = new server_1.ApolloServer({
        // These will be defined for both new or existing servers
        schema,
        csrfPrevention: false,
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
    app.use("/graphql", (0, cors_1.default)(corsOptions), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const session = await (0, react_1.getSession)({ req });
            return { pubsub, prisma, session };
        },
    }));
    const port = process.env.PORT || 3000;
    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
}
main().catch((err) => console.log(err));
