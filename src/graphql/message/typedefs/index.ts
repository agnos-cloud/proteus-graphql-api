import mutations from "./message.mutations.typedefs";
import queries from "./message.queries.typedefs";
import types from "./message.types.typedefs";
import subscriptions from "./message.subscriptions.typedefs";

const typeDefs = [types, queries, mutations, subscriptions];

export default typeDefs;