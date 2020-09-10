import * as itemTypes from './itemTypes'
import { Item, NFT, Metadata } from '../../entities/schema'
import { setNFTWearableSearchFields, setItemWearableSearchFields, buildWearableItem, buildWearableV1, getWearableV1Representation } from './wearable'

/**
 * @notice the item's metadata must follow: version:item_type:representation_id:data
 */
export function buildItemMetadata(item: Item): Metadata {
  let id = item.id
  let metadata = Metadata.load(id)

  if (metadata == null) {
    metadata = new Metadata(id)
  }

  let data = item.rawMetadata.split(':')
  if (data.length >= 2) {
    let type = data[1]

    if (type == itemTypes.WEARABLE_TYPE_SHORT) {
      let wearable = buildWearableItem(item)
      metadata.itemType = itemTypes.WEARABLE
      metadata.wearable = wearable.id
    } else {
      metadata.itemType = itemTypes.UNDEFINED
    }
  } else {
    metadata.itemType = itemTypes.UNDEFINED
  }

  metadata.save()

  return metadata!
}


export function buildWearableV1Metadata(nft: NFT): Metadata {
  let representation = getWearableV1Representation(nft)

  let metadata = new Metadata(representation.id)

  let wearable = buildWearableV1(nft, representation)

  metadata.itemType = itemTypes.WEARABLE
  metadata.wearable = wearable.id

  metadata.save()

  return metadata!
}


export function setItemSearchFields(item: Item): Item {
  if (item.itemType == itemTypes.WEARABLE) {
    return setItemWearableSearchFields(item)
  }

  return item
}

export function setNFTSearchFields(nft: NFT): NFT {
  if (nft.itemType == itemTypes.WEARABLE) {
    return setNFTWearableSearchFields(nft)
  }

  return nft
}
