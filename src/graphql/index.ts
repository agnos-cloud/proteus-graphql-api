import org from "./org";
import merge from "lodash.merge";

export default {
    resolvers: merge({}, org.resolvers),
    typeDefs: [
        ...org.typeDefs,
    ],
};
