# Decentraland collections graph

| Network    | Provider        | URL                                                                                     | Current                                        | Previous                                       |
| ---------- | --------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Mainnet    | Satsuma         | https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-mainnet/playground  | Qmf4SMTepdDoFh1ozcaAUMieGF83tnNa2G2Jr4KkH5jPRA | QmcyYqqmE3egvtZReHk1aVxmZawxRSECuj1PcZLgMVzHSp |
| Mainnet    | Hosted Services | https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-mainnet        | Qmf4SMTepdDoFh1ozcaAUMieGF83tnNa2G2Jr4KkH5jPRA | QmP2EQebbD9W8AaphRTzNUL7NLdMH8FdqNNWtqUiNg2VkB |
| Sepolia    | Satsuma         | https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-sepolia/playground  | QmSYyRTthY69mSHxkAY6ym3beCWQr97NwecWdpxjiHypKh | QmWQZiMSV5AnUPN34NFmAYtxGntxewMUUwuS9r5vBpc5Ys |
| Sepolia    | Graph Studio    | https://api.studio.thegraph.com/query/49472/collections-ethereum-sepolia/version/latest | QmSYyRTthY69mSHxkAY6ym3beCWQr97NwecWdpxjiHypKh | QmWQZiMSV5AnUPN34NFmAYtxGntxewMUUwuS9r5vBpc5Ys |
| Goerli     | Satsuma         | https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-goerli/playground   | QmZXxk89ZunJvXNsckSioadZNQW7VBydrGfXTqS2ivzHqU | QmUvtxgRKdFf1zcZZLrJ5nZ6HyoUYKPtByGQigP4rHxwSj |
| Goerli     | Hosted Services | https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-goerli         | QmZXxk89ZunJvXNsckSioadZNQW7VBydrGfXTqS2ivzHqU | QmUvtxgRKdFf1zcZZLrJ5nZ6HyoUYKPtByGQigP4rHxwSj |
| Matic      | Satsuma         | https://subgraph.satsuma-prod.com/decentraland/collections-matic-mainnet/playground     | QmPAV5PzFgu7iaiSYYmRTPGFR4ADGfeKSTPqTPt5eKVAVv | QmdavX3eGWLYCjjzYAZv924hyoLv8f9Rg6FxHD7kAJ4fXn |
| Matic      | Hosted Services | https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet           | QmPAV5PzFgu7iaiSYYmRTPGFR4ADGfeKSTPqTPt5eKVAVv | QmXEwSeNTT5xHRQPcTUDQJayjjfhcbaxYf2o7ycuYf8YF7 |
| Matic Temp | Hosted Services | https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet-temp      | QmTKztw187jUHZ33S2pndtyo68K462XwewcvMVAVH7mwZR | Qmf3igvJs24gozdwCwnDyPNz9DEBQMPQRFmEhUzEvgxZSq |
| Mumbai     | Satsuma         | https://subgraph.satsuma-prod.com/decentraland/collections-matic-mumbai/playground      | QmdqoM3jpJWWbK1EMTZcSE5WJgiUaoSpKcSLeQRHhqQSea | QmYVGaMGvqkcBMrJ4F5XrkzwCzhB3FfJvHRBERbtgovCai |
| Mumbai     | Hosted Service  | https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mumbai            | QmdqoM3jpJWWbK1EMTZcSE5WJgiUaoSpKcSLeQRHhqQSea | QmYVGaMGvqkcBMrJ4F5XrkzwCzhB3FfJvHRBERbtgovCai |

Using [The Graph](https://thegraph.com) and [Alchemy](https://www.alchemy.com/)

### Install

```bash
npm ci
```

### Test

Tests are defined inside the `./tests` directory and executed using:

```bash
npm test
```

> **Take into consideration:**
>
> `Postgres 14` is required to run tests locally because `graph-node`, the underlying engine to index the subgraph, needs it.

An alternative to run tests locally without installing Postgres is through `Docker. To run them, use the following command:

```
npm run test:docker
```

> **CI Notice:**
>
> Tests are run on the CI using `npm test` because the `ubuntu-latest` image used in the CI contains Postgres 14.

More about how to write subgraph tests can be found on the [graph's unit testing documentation](https://thegraph.com/docs/en/developing/unit-testing-framework/).

### Deploy

```bash
npm run deploy:{network}
```

### Queries

The collection's `id` is the smart contract address of the collection.
The item's `id` is `{collection_contract_address}-{item_blochain_id}`. The `item_blockchain_id` is the index of the item in the collection. E.g: if you have a collection with 2 items, the first is `0` and the second one is `1`. Therefore, the id of the first item will be: `{contract_address}-0`

Ethereum addresses should be passed lowercased:

- `0xB549B2442b2BD0a53795BC5cDcBFE0cAF7ACA9f8` ❌
- `0xb549b2442b2bd0a53795bc5cdcbfe0caf7aca9f8` ✅

#### Get first 5 collections and items balances

```typescript
{
  collections(first: 5) {
    id
    items {
      id
    }
    owner
    creator
  }

  items(first: 5) {
    id
    collection {
      id
    }
    blockchainId
    itemType
  }
}
```

### Get Item Metadata

```typescript
{
  items(first: 1) {
    id
    rawMetadata
    metadata {
      itemType
      wearable {
        description
        bodyShapes
        rarity
        category
      }
    }
  }
}
```

#### Get first 5 Collection NFTs

Owner's `id` is the owner's Ethereum address

```typescript
{
  nfts(first: 5) {
    id
    tokenId
    owner {
      id
    }
  }
}
```

#### Get first 5 Collection NFTs Orders

```typescript
{
  orders(first: 5) {
    id
    nftAddress
    price
    buyer
    status
    nft {
      id
    }
  }
}
```

#### Get totals

```typescript
{
  counts {
    collectionTotal
    itemTotal
    nftTotal
    orderTotal
  }
}
```
