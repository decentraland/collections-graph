# Decentraland collections graph

|Network|URL|Current|Previous|
|-|-|-|-|
|Mainnet (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-mainnet |QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|QmWrLR11uq12yDD7qUFzeyYEFXxQiU2UcKFYZLrccCYkwk|
|Mainnet (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-ethereum-mainnet/playground|QmXAJWxr83ff8yqZkK8NrWUxETRHyXbq69sy2bmQznT136|-|
|Goerli (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-goerli|QmXbmCWShvjizcePNj2BqxqsWxdb4sxK83RvDeF1gFcFDG|QmSjgZDY25SNr3kW6bsQWcSeh3NRoojtbrMSrXvKz4BsvJ|
|Ropsten (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-ethereum-ropsten|QmbkYp3VQAvfMqsnYdNhbgYRxJ14mkBF2PnhAVLvs21asT|-|
|Matic (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet|Qmc1XwMPmbVNCqvbTkTNWxGogcZLxQ72WwTsgHVbRTJ7XD|QmNrxac6yGrZWKwYLNSFagwRcGEmHUeurwfVyfYppzAs6x|
|Matic Temp (Hosted Services)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mainnet-temp|QmNrxac6yGrZWKwYLNSFagwRcGEmHUeurwfVyfYppzAs6x|QmaPNpL5oB4NjrTFmWAE4CesMjfhjouCigwptNz7x9i8cD|
|Matic (Satsuma)|https://subgraph.satsuma-prod.com/decentraland/collections-matic-mainnet/playground|Qmc1XwMPmbVNCqvbTkTNWxGogcZLxQ72WwTsgHVbRTJ7XD|QmaQmyuQeQQv2SVrj7uckChi1BMmCNaKQ3UMpL6JZxrSXs|
|Mumbai (Hosted Service)|https://thegraph.com/explorer/subgraph/decentraland/collections-matic-mumbai|QmfZsAg5pbMBpwY1WuDR7QPfUZ3oNEkNagVXcQ42nKX1C5|Qmebs8WsrLs23pQ2oCZggVFN5raZffPx5Auqh1K1pr7iQQ|

Using [The Graph](https://thegraph.com) and [Satsuma](https://www.satsuma.xyz/)

### Install

```bash
npm run install
```

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
