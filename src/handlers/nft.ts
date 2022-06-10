import { BigInt, Address, log } from '@graphprotocol/graph-ts'

import { getItemId, getItemImage } from '../modules/Item'
import { createOrLoadAccount, ZERO_ADDRESS } from '../modules/Account'
import { setItemSearchFields, setNFTSearchFields, buildWearableV1Metadata } from '../modules/Metadata'
import * as itemTypes from '../modules/Metadata/itemTypes'
import {
  getWearableIdFromTokenURI,
  getWearableV1Representation,
  getIssuedIdFromTokenURI,
  getURNForCollectionV1,
  getURNForWearableV1
} from '../modules/Metadata/wearable'
import { getNFTId, getTokenURI, isMint, cancelActiveOrder, clearNFTOrderProperties } from '../modules/NFT'
import { NFT, Item, Collection, Mint } from '../entities/schema'
import { buildCountFromCollection, buildCountFromNFT, buildCountFromItem, buildCountFromPrimarySale } from '../modules/Count'
import { Issue, Transfer, CollectionV2 as CollectionContract } from '../entities/templates/CollectionV2/CollectionV2'
import { CollectionStore } from '../entities/templates/CollectionStore/CollectionStore'
import { Transfer as ERC721Transfer, AddWearable } from '../entities/templates/ERC721/ERC721'
import { getStoreAddress } from '../modules/store'
import { MINT_SALE_TYPE, trackSale } from '../modules/analytics'
import { toLowerCase } from '../utils'

/**
 * @notice mint an NFT by a collection v2 issue event
 * @param event
 * @param collectionAddress
 * @param item
 */
export function handleMintNFT(event: Issue, collectionAddress: string, item: Item): void {
  let nftId = getNFTId(collectionAddress, event.params._tokenId.toString())
  let nft = new NFT(nftId)

  let issuedId = event.params._issuedId

  let collection = Collection.load(collectionAddress)
  if (!collection) {
    return
  }
  nft.collection = collection.id
  nft.tokenId = event.params._tokenId
  nft.contractAddress = collectionAddress
  nft.itemBlockchainId = event.params._itemId
  nft.itemType = item.itemType
  nft.issuedId = event.params._issuedId
  nft.collection = collectionAddress
  nft.item = item.id
  nft.urn = item.urn
  nft.owner = event.params._beneficiary.toHexString()
  nft.tokenURI = item.URI + '/' + issuedId.toString()
  nft.image = item.image
  nft.metadata = item.metadata

  nft.createdAt = event.block.timestamp
  nft.updatedAt = event.block.timestamp
  nft.soldAt = null

  nft.sales = 0
  nft.volume = BigInt.fromI32(0)

  nft = setNFTSearchFields(nft)

  createOrLoadAccount(event.params._beneficiary)

  let metric = buildCountFromNFT()
  metric.save()

  nft.save()

  // store mint data
  let minterAddress = event.params._caller.toHexString()
  let isStoreMinter = minterAddress == getStoreAddress()
  let mint = new Mint(nftId)
  mint.nft = nft.id
  mint.item = item.id
  mint.beneficiary = nft.owner
  mint.creator = item.creator
  mint.minter = minterAddress
  mint.timestamp = event.block.timestamp
  mint.searchContractAddress = nft.contractAddress
  mint.searchTokenId = nft.tokenId
  mint.searchItemId = item.blockchainId
  mint.searchIssuedId = issuedId
  mint.searchIsStoreMinter = isStoreMinter

  // count primary sale
  if (isStoreMinter) {
    // Bind contract
    let storeContract = CollectionStore.bind(Address.fromString(minterAddress))

    let seller = item.creator
    if (item.beneficiary != ZERO_ADDRESS) {
      seller = item.beneficiary
    }

    mint.searchPrimarySalePrice = item.price
    trackSale(
      MINT_SALE_TYPE,
      event.params._beneficiary,
      Address.fromString(seller),
      item.id,
      nft.id,
      item.price,
      storeContract.fee(),
      storeContract.feeOwner(),
      BigInt.fromI32(0),
      event.block.timestamp,
      event.transaction.hash
    )
  }

  mint.save()
}

export function handleTransferNFT(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let collectionAddress = event.address.toHexString()
  let id = getNFTId(collectionAddress, event.params.tokenId.toString())

  let nft = NFT.load(id)
  if (!nft) {
    return
  }

  nft.owner = event.params.to.toHex()
  nft.updatedAt = event.block.timestamp

  if (cancelActiveOrder(nft, event.block.timestamp)) {
    nft = clearNFTOrderProperties(nft)
  }

  createOrLoadAccount(event.params.to)

  nft.save()
}

export function handleAddItemV1(event: AddWearable): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)
  let collectionContract = CollectionContract.bind(Address.fromString(collectionAddress))

  let owner = collectionContract.owner().toHexString()

  // Create Collection
  if (collection == null) {
    // Bind contract
    collection = new Collection(collectionAddress)

    log.debug('Creating collection {}', [collectionAddress])

    // Set base collection data
    collection.name = collectionContract.name()
    collection.symbol = collectionContract.symbol()
    collection.owner = owner
    collection.creator = owner
    collection.isCompleted = true
    collection.minters = []
    collection.managers = []
    collection.itemsCount = 0
    collection.urn = getURNForCollectionV1(collection)
    collection.createdAt = event.block.timestamp // Not going to be used
    collection.updatedAt = event.block.timestamp // Not going to be used
    collection.reviewedAt = event.block.timestamp // Not going to be used
    collection.searchIsStoreMinter = false
    collection.searchText = toLowerCase(collection.name)
    collection.isApproved = true

    collection.save()

    let collectionMetric = buildCountFromCollection()
    collectionMetric.save()
  }

  // Count item
  collection.itemsCount += 1
  collection.save()

  let id = getItemId(collectionAddress, event.params._wearableId)
  let representation = getWearableV1Representation(event.params._wearableId)

  let item = new Item(id)
  item.creator = owner
  item.blockchainId = BigInt.fromI32(collection.itemsCount)
  item.collection = collectionAddress
  item.creationFee = BigInt.fromI32(0)
  item.rarity = representation!.rarity
  item.available = event.params._maxIssuance
  item.totalSupply = BigInt.fromI32(0)
  item.maxSupply = item.available
  item.price = BigInt.fromI32(0) // Not used for collections v1
  item.beneficiary = ZERO_ADDRESS // Not used for collections v1
  item.rawMetadata = '' // Not used for collections v1
  item.searchIsCollectionApproved = true // Not used for collections v1
  item.minters = [] // Not used for collections v1
  item.managers = [] // Not used for collections v1
  item.URI = collectionContract.baseURI() + event.params._wearableId
  item.urn = getURNForWearableV1(collection, representation!.id)
  item.image = getItemImage(item)
  item.createdAt = event.block.timestamp // Not used for collections v1
  item.updatedAt = event.block.timestamp // Not used for collections v1
  item.reviewedAt = event.block.timestamp // Not used for collections v1
  item.searchIsStoreMinter = false // Not used for collections v1
  item.soldAt = null
  item.sales = 0
  item.volume = BigInt.fromI32(0)
  item.uniqueCollectors = []
  item.uniqueCollectorsTotal = 0

  let metadata = buildWearableV1Metadata(item, representation!)
  item.metadata = metadata.id
  item.itemType = metadata.itemType

  item = setItemSearchFields(item)
  item.save()

  let metric = buildCountFromItem()
  metric.save()
}

export function handleTransferWearableV1(event: ERC721Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  let tokenURI = getTokenURI(event.address, event.params.tokenId)
  let representationId = getWearableIdFromTokenURI(tokenURI)

  let itemId = getItemId(event.address.toHexString(), representationId)
  let item = Item.load(itemId)

  if (item == null) {
    log.error('No item associated for NFT {}', [representationId])
    return
  }

  let id = getNFTId(event.address.toHexString(), event.params.tokenId.toString())

  let nft = new NFT(id)

  nft.collection = collection!.id
  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to.toHex()
  nft.contractAddress = collectionAddress
  nft.updatedAt = event.block.timestamp
  nft.soldAt = null
  nft.itemType = itemTypes.WEARABLE_V1
  nft.tokenURI = tokenURI
  nft.item = item.id

  nft.urn = item.urn

  nft.sales = 0
  nft.volume = BigInt.fromI32(0)

  if (isMint(event.params.from.toHexString())) {
    nft.itemBlockchainId = item.blockchainId
    nft.issuedId = BigInt.fromI32(getIssuedIdFromTokenURI(tokenURI) as i32)
    nft.metadata = item.metadata
    nft.itemType = item.itemType
    nft.image = item.image
    nft.createdAt = event.block.timestamp

    nft = setNFTSearchFields(nft)

    let nftMetric = buildCountFromNFT()
    nftMetric.save()

    item.available = item.available.minus(BigInt.fromI32(1))
    item.totalSupply = item.totalSupply.plus(BigInt.fromI32(1))

    item.save()

    // store mint
    let mint = new Mint(id)
    mint.nft = nft.id
    mint.item = item.id
    mint.beneficiary = nft.owner
    mint.creator = ZERO_ADDRESS // v1 collections don't have a creator
    mint.minter = event.transaction.from.toHexString()
    mint.timestamp = event.block.timestamp
    mint.searchContractAddress = nft.contractAddress
    mint.searchTokenId = nft.tokenId
    mint.searchItemId = item.blockchainId
    mint.searchIssuedId = nft.issuedId
    mint.searchIsStoreMinter = false
    mint.save()
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft)
    }
  }

  createOrLoadAccount(event.params.to)

  nft.save()
}
