# Decentraland collections graph

|Network|URL|Current|Previous|
|-|-|-|-|
|Mainnet (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-mainnet/playground|Qmf1ouGZcxBegEWodVy5fjFYFgQaB7wzw7j5rHwLcKeSXB|QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|
|Mainnet (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-mainnet|QmPjcwU1HSxWAf9sMyAag6NGSYxP2Y2U2PAx4sPg15mmJZ|QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|
|Sepolia (Graph Studio)|https://api.studio.thegraph.com/query/49472/collections-ethereum-sepolia/0.0.3|Qmd7dUidBJrNqp6kKDifBfCumZ4efe9h81cX6GYkW1inHe|-|
|Goerli (Satsuma)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-goerli|QmSSzDJBxX7Kj4EqszCUw3AHiznkt5W1fJEpLhiTsVdaqN|QmbL8a1aMAuKoMZKNjjP2pzyekFqb6AdRWji3nsPnQkEoo|
|Goerli (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-goerli|QmTNQHzovP1WLp1zBmJvU72uRpHhmzeHe1wb1hwysaXx6F|QmPtETAfzq2eCJ3U7HsS5ugC7L4WK4oNZ6RaNkYoKZZbZL|
|Matic (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-matic-mainnet/playground|Qmf1ouGZcxBegEWodVy5fjFYFgQaB7wzw7j5rHwLcKeSXB|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|
|Matic (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet|Qmf3igvJs24gozdwCwnDyPNz9DEBQMPQRFmEhUzEvgxZSq|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|
|Matic Temp (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet-temp|QmXyrt3tNkrnDRopnMdY7Na9y8jbKi1645gbR4cJTURbk5|QmUCo2VWg5Cj8C46nS1LNVemLbiXPcf2ad75d3dMrhdpJv|
|Mumbai (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-matic-mumbai/playground|QmeSvj8AMGwFcQSoDdbMnB1SrVhrhAYq2DaUukEdMDpZ3v|QmQRwsc2CCebd4KVHNVeTcLZacqc3PGU5gt6yEo1n19x7L|
|Mumbai (Hosted Service)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mumbai|QmdwRWh1FeGi3bJFYkD1Hu8w2uHvAHzJqbdCtszymfoqDS|QmQRwsc2CCebd4KVHNVeTcLZacqc3PGU5gt6yEo1n19x7L|

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

> **Take into consideration:**
>`Postgres 14` is required to run tests locally because `graph-node`, the underlying engine to index the subgraph, needs it.

An alternative to run tests locally without installing Postgres is through `Docker. To run them, use the following command:

```
npm run test:docker
```

> **CI Notice:**
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
