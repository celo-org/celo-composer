import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/id/QmcBHXxQo2D89snhaud3fMhdbxTkj7YgZSAFeaMyrVS4oL",
    cache: new InMemoryCache(),
});

export default client;