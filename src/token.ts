import { gql } from "@apollo/client";
import { getGraphClient } from "./client";

async function fetchSwapsFromBlock(block: number) {
  const client = getGraphClient();

  const res = await client.query({
    query: gql`
    query swaps($block: BigInt!) {
        swaps(
          orderBy: blockNumber
          orderDirection: asc
          where: { blockNumber_gt: $block }
          first: 1000
        ) {
          amountIn
          amountOut
          blockNumber
          timestamp
          tokenIn {
            lastPriceUSD
            lastPriceBlockNumber
            decimals
            id
          }
          tokenOut {
            id
            lastPriceUSD
            lastPriceBlockNumber
            decimals
          }
          pool {
            id
          }
        }
      }
    `,
    variables: { block: block },
  });
  if (res.errors || !res.data) {
    console.log("query swap failed:", res);
    return [];
  }
  return res.data["swaps"];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let block = 19167564;

  for (;;) {
    try {
      const prices = await fetchSwapsFromBlock(block);
      if (prices.length === 0) {
        console.log(`not found swaps at block ${block}`)
        block += 1
        await sleep(2000);
      } else {
        const latest = +(prices[prices.length-1].blockNumber)
        console.log(`got swaps ${prices.length}, from block ${block} to block ${latest}`)
        block = latest
      }
    } catch (err) {
      console.log("fetch failed:", err);
    }
  }
})();

