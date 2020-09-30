import { Address, log } from '@graphprotocol/graph-ts'

import { createAccount } from '../modules/Account'
import { setNFTSearchFields, buildWearableV1Metadata } from '../modules/metadata'
import * as itemTypes from '../modules/metadata/itemTypes'
import { getWearableV1Image, getWearableIdFromTokenURI } from '../modules/metadata/wearable'
import {
  getNFTId, getTokenURI, isMint, cancelActiveOrder,
  clearNFTOrderProperties
} from '../modules/NFT'
import { NFT, Item, Collection, Wearable } from '../entities/schema'
import { buildCountFromCollection, buildCountFromNFT } from '../modules/Count'
import { Issue, Transfer, CollectionV2 as CollectionContract } from '../entities/templates/CollectionV2/CollectionV2'
import { Transfer as ERC721Transfer } from '../entities/templates/ERC721/ERC721'


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
  nft.image = item.URI + '/' + event.params._issuedId.toString() + '/thumbnail'
  nft.searchText = item.rawMetadata
  nft.metadata = item.metadata
  nft.catalystEntityId = event.address.toHexString() + '-' + event.params._itemId.toString()

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


export function handleTransferWearableV1(event: ERC721Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  // Create Collection
  if (collection == null) {
    // Bind contract
    let collectionContract = CollectionContract.bind(Address.fromString(collectionAddress))

    collection = new Collection(collectionAddress)

    log.debug('Creating collection {}', [collectionAddress])

    // Set base collection data
    collection.name = collectionContract.name()
    collection.symbol = collectionContract.symbol()
    collection.owner = collectionContract.owner().toHexString()
    collection.isCompleted = true
    collection.createdAt = event.block.timestamp // Not going to be used
    collection.minters = []
    collection.managers = []

    collection.save()

    let collectionMetric = buildCountFromCollection()
    collectionMetric.save()
  }

  let tokenURI = getTokenURI(event.address, event.params.tokenId)
  let representationId = getWearableIdFromTokenURI(tokenURI)

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
  nft.itemType = itemTypes.WEARABLE
  nft.tokenURI = tokenURI
  nft.catalystEntityId = event.address.toHexString() + '-' + representationId

  if (isMint(event.params.from.toHexString())) {
    nft.createdAt = event.block.timestamp
    nft.searchText = ''

    let metadata = buildWearableV1Metadata(nft)
    nft.metadata = metadata.id
    nft.itemType = metadata.itemType

    let wearable = Wearable.load(metadata.wearable)

    nft.image = getWearableV1Image(wearable!)


    nft = setNFTSearchFields(nft)

    let nftMetric = buildCountFromNFT()
    nftMetric.save()
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft!)
    }
  }

  createAccount(event.params.to)

  nft.save()
}