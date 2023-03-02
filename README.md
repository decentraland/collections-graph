# Decentraland collections graph

|Network|URL|Current|Previous|
|-|-|-|-|
|Mainnet (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-mainnet/playground|QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|-|
|Mainnet (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-mainnet |QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|QmWrLR11uq12yDD7qUFzeyYEFXxQiU2UcKFYZLrccCYkwk|
|Goerli (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-goerli|QmXbmCWShvjizcePNj2BqxqsWxdb4sxK83RvDeF1gFcFDG|QmSjgZDY25SNr3kW6bsQWcSeh3NRoojtbrMSrXvKz4BsvJ|
|Matic (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-matic-mainnet/playground|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|Qmc1XwMPmbVNCqvbTkTNWxGogcZLxQ72WwTsgHVbRTJ7XD|
|Matic (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|Qmc1XwMPmbVNCqvbTkTNWxGogcZLxQ72WwTsgHVbRTJ7XD|
|Matic Temp (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet-temp|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|QmNrxac6yGrZWKwYLNSFagwRcGEmHUeurwfVyfYppzAs6x|
|Mumbai (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-matic-mumbai/playground|QmQRwsc2CCebd4KVHNVeTcLZacqc3PGU5gt6yEo1n19x7L|-|
|Mumbai (Hosted Service)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mumbai|QmQRwsc2CCebd4KVHNVeTcLZacqc3PGU5gt6yEo1n19x7L|QmfZsAg5pbMBpwY1WuDR7QPfUZ3oNEkNagVXcQ42nKX1C5|

Using [The Graph](https://thegraph.com) and [Satsuma](https://www.satsuma.xyz/)

### Install

```bash
npm ci
```

### Test

Tests are defined inside the `./tests` directory and executed using:

```bash
npm test
```

`Postgres 14` is required to run tests locally. That is because `graph-node`, the underlying engine to index the subgraph, needs it.

An alternative to run tests locally without Postgres is to have `Docker` installed. In that case, tests can be run using:

```
npm run test:docker
```

Tests are run on PRs to master just with `npm test` because the `ubuntu-latest` image being used contains Postgres 14.

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
