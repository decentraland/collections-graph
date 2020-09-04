import { createAccount } from '../modules/Account'
import { setNFTSearchFields } from '../modules/Metadata'
import {
  getNFTId, cancelActiveOrder,
  clearNFTOrderProperties
} from '../modules/NFT'
import { NFT, Item } from '../entities/schema'
import { buildCountFromNFT } from '../modules/Count'
import { Issue, Transfer } from '../entities/templates/CollectionV2/CollectionV2'

export function handleCreateNFT(event: Issue, collectionAddress: string, item: Item): void {
  let nft = new NFT(getNFTId(collectionAddress, event.params._tokenId.toHexString()))

  nft.tokenId = event.params._tokenId
  nft.contractAddress = collectionAddress
  nft.itemId = event.params._itemId
  nft.itemType = item.type
  nft.issuedId = event.params._issuedId
  nft.collection = collectionAddress
  nft.item = item.id
  nft.owner = event.params._beneficiary.toHexString()
  nft.tokenURI = item.URI + '/' + event.params._issuedId.toString()
  nft.name = 'Token item'
  nft.image = item.URI + '/' + event.params._issuedId.toString() + '/thumbnail'
  nft.searchText = item.rawMetadata
  nft.createdAt = event.block.timestamp
  nft.updatedAt = event.block.timestamp

  nft = setNFTSearchFields(nft)

  createAccount(event.params._beneficiary)

  let metric = buildCountFromNFT()
  metric.save()

  nft.save()
}

export function handleNFTTransfer(event: Transfer): void {
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