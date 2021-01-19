import { BigInt, Address, log } from '@graphprotocol/graph-ts'

import { getItemId } from '../modules/Item'
import { createAccount, ZERO_ADDRESS } from '../modules/Account'
import { setItemSearchFields, setNFTSearchFields, buildWearableV1Metadata } from '../modules/Metadata'
import * as itemTypes from '../modules/Metadata/itemTypes'
import { getWearableV1Image, getWearableIdFromTokenURI, getWearableV1Representation, getIssuedIdFromTokenURI } from '../modules/Metadata/wearable'
import {
  getNFTId, getTokenURI, isMint, cancelActiveOrder,
  clearNFTOrderProperties
} from '../modules/NFT'
import { NFT, Item, Collection } from '../entities/schema'
import { buildCountFromCollection, buildCountFromNFT, buildCountFromItem } from '../modules/Count'
import { Issue, Transfer, CollectionV2 as CollectionContract } from '../entities/templates/CollectionV2/CollectionV2'
import { Transfer as ERC721Transfer, AddWearable } from '../entities/templates/ERC721/ERC721'


/**
 * @notice mint an NFT by a collection v2 issue event
 * @param event
 * @param collectionAddress
 * @param item
 */
export function handleMintNFT(event: Issue, collectionAddress: string, item: Item): void {
  let nft = new NFT(getNFTId(collectionAddress, event.params._tokenId.toString()))

  let collection = Collection.load(collectionAddress)
  nft.collection = collection.id
  nft.tokenId = event.params._tokenId
  nft.contractAddress = collectionAddress
  nft.itemBlockchainId = event.params._itemId
  nft.itemType = item.itemType
  nft.issuedId = event.params._issuedId
  nft.collection = collectionAddress
  nft.item = item.id
  nft.owner = event.params._beneficiary.toHexString()
  nft.tokenURI = item.URI + '/' + event.params._issuedId.toString()
  nft.image = item.image
  nft.metadata = item.metadata
  nft.catalystPointer = event.address.toHexString() + '-' + event.params._itemId.toString()

  nft.createdAt = event.block.timestamp
  nft.updatedAt = event.block.timestamp

  nft = setNFTSearchFields(nft)

  createAccount(event.params._beneficiary)

  let metric = buildCountFromNFT()
  metric.save()

  nft.save()
}

export function handleTransferNFT(event: Transfer): void {
  if (event.params.tokenId.toString() == '') { //@TODO: could this happen?
    return
  }

  let collectionAddress = event.address.toHexString()
  let id = getNFTId(collectionAddress, event.params.tokenId.toString())

  let nft = NFT.load(id)

  nft.owner = event.params.to.toHex()
  nft.updatedAt = event.block.timestamp

  if (cancelActiveOrder(nft!, event.block.timestamp)) {
    nft = clearNFTOrderProperties(nft!)
  }

  createAccount(event.params.to)

  nft.save()
}

export function handleAddItemV1(event: AddWearable): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)
  let collectionContract = CollectionContract.bind(Address.fromString(collectionAddress))

  // Create Collection
  if (collection == null) {
    // Bind contract
    collection = new Collection(collectionAddress)

    log.debug('Creating collection {}', [collectionAddress])

    // Set base collection data
    collection.name = collectionContract.name()
    collection.symbol = collectionContract.symbol()
    collection.owner = collectionContract.owner().toHexString()
    collection.isCompleted = true
    collection.minters = []
    collection.managers = []
    collection.itemsCount = 0
    collection.createdAt = event.block.timestamp // Not going to be used

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
  item.blockchainId = BigInt.fromI32(collection.itemsCount)
  item.collection = collectionAddress
  item.rarity = representation.rarity
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
  item.image = getWearableV1Image(collection!, item, event.params._wearableId)

  let metadata = buildWearableV1Metadata(item, representation)
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

  let id = getNFTId(
    event.address.toHexString(),
    event.params.tokenId.toString()
  )

  let nft = new NFT(id)

  nft.collection = collection.id
  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to.toHex()
  nft.contractAddress = collectionAddress
  nft.updatedAt = event.block.timestamp
  nft.itemType = itemTypes.WEARABLE_V1
  nft.tokenURI = tokenURI
  nft.item = item.id

  let collectionName = collection.name.split('dcl://')
  nft.catalystPointer = (collectionName.length > 1 ? collectionName[1] : collectionName[0]) + '-' + representationId

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
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft!)
    }
  }

  createAccount(event.params.to)

  nft.save()
}