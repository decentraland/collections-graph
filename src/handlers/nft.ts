import { createAccount } from '../modules/Account'
import { getItemMetadata, setNFTSearchFields, buildWearableV1Metadata, WEARABLE } from '../modules/metadata'
import { getWearableV1Image } from '../modules/metadata/wearable'
import {
  getNFTId, getTokenURI, isMint, cancelActiveOrder,
  clearNFTOrderProperties
} from '../modules/NFT'
import { NFT, Item, Collection, Wearable } from '../entities/schema'
import { buildCountFromNFT } from '../modules/Count'
import { Issue, Transfer } from '../entities/templates/CollectionV2/CollectionV2'

/**
 * @notice create an NFT by a collection v2 issue event
 * @param event
 * @param collectionAddress
 * @param item
 */
export function handleCreateNFT(event: Issue, collectionAddress: string, item: Item): void {
  let nft = new NFT(getNFTId(collectionAddress, event.params._tokenId.toHexString()))

  let collection = Collection.load(collectionAddress)
  nft.collection = collection.id
  nft.tokenId = event.params._tokenId
  nft.contractAddress = collectionAddress
  nft.itemId = event.params._itemId
  nft.itemType = item.itemType
  nft.issuedId = event.params._issuedId
  nft.collection = collectionAddress
  nft.item = item.id
  nft.owner = event.params._beneficiary.toHexString()
  nft.tokenURI = item.URI + '/' + event.params._issuedId.toString()
  nft.name = 'Token item'
  nft.image = item.URI + '/' + event.params._issuedId.toString() + '/thumbnail'
  nft.searchText = item.rawMetadata

  let metadata = getItemMetadata(item)
  nft.metadata = metadata.id

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
  let id = getNFTId(collectionAddress, event.params.tokenId.toHexString())

  let nft = NFT.load(id)

  nft.owner = event.params.to.toHex()
  nft.updatedAt = event.block.timestamp

  if (cancelActiveOrder(nft!, event.block.timestamp)) {
    nft = clearNFTOrderProperties(nft!)
  }

  createAccount(event.params.to)

  nft.save()
}


export function handleTransferWearableV1(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let collectionAddress = event.address.toHexString()
  let id = getNFTId(
    event.address.toHexString(),
    event.params.tokenId.toString()
  )

  let nft = new NFT(id)

  let collection = Collection.load(collectionAddress)
  nft.collection = collection.id
  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to.toHex()
  nft.contractAddress = collectionAddress
  nft.updatedAt = event.block.timestamp
  nft.itemType = WEARABLE
  nft.tokenURI = getTokenURI(event.address, event.params.tokenId)

  if (isMint(event.params.to.toHexString())) {
    nft.createdAt = event.block.timestamp
    nft.searchText = ''

    let metadata = buildWearableV1Metadata(nft)
    nft.metadata = metadata.id
    nft.itemType = metadata.itemType

    let wearable = Wearable.load(metadata.id)
    nft.image = getWearableV1Image(wearable!)

    nft = setNFTSearchFields(nft)

    // nft.searchText = toLowerCase(wearable.name)

    let metric = buildCountFromNFT()
    metric.save()
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft!)
    }
  }

  createAccount(event.params.to)

  nft.save()
}