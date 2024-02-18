// apollo clients
import {
  ApolloClient,
  ApolloClientOptions,
  InMemoryCache,
} from "@apollo/client";

import _ from "lodash";

export const getGraphClient = () => {
  return createApolloClient(
    "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum"
  );
};

function createApolloClient(uri: string, opts?: any) {
  const options: ApolloClientOptions<any> = {
    uri: uri,
    cache: new InMemoryCache({
      typePolicies: {
        Token: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
        Pool: {
          // Singleton types that have no identifying field can use an empty
          // array for their keyFields.
          keyFields: false,
        },
      },
    }),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  };
  opts && _.assign(options, opts);
  // console.log(options)
  return new ApolloClient(options);
  // {
  // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap',
  // ...options,
  // uri: uri,
  // });
}
