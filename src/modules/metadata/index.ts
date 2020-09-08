import { Item, NFT, Metadata } from '../../entities/schema'
import { setNFTWearableSearchFields, setItemWearableSearchFields, buildWearableItem, buildWearableV1, getWearableV1Representation } from './wearable'

// Item categories
export const BODY_SHAPE = 'body_shape'
export const EARRING = 'earring'
export const EYEBROWS = 'eyebrows'
export const EYES = 'eyes'
export const EYEWEAR = 'eyewear'
export const FACIAL_HAIR = 'facial_hair'
export const FEET = 'feet'
export const HAIR = 'hair'
export const HAT = 'hat'
export const HELMET = 'helmet'
export const LOWER_BODY = 'lower_body'
export const MASK = 'mask'
export const MOUTH = 'mouth'
export const TIARA = 'tiara'
export const TOP_HEAD = 'top_head'
export const UPPER_BODY = 'upper_body'

// Item types
export const WEARABLE = 'wearable'
export const WEARABLE_TYPE_SHORT = 'w'


export function getItemMetadata(item: Item): Metadata {
  return Metadata.load(item.metadata)!
}

/**
 * @param item
 */
export function buildItemMetadata(item: Item): Metadata {
  let id = item.id
  let metadata = Metadata.load(id)

  if (metadata == null) {
    metadata = new Metadata(id)
  }

  let data = item.rawMetadata.split(':')
  if (data.length >= 1) {
    let type = data[1]

    if (type == WEARABLE_TYPE_SHORT) {
      let wearable = buildWearableItem(item)
      metadata.itemType = WEARABLE
      metadata.wearable = wearable.id
      metadata.save()
    }
  }

  return metadata!
}

/**
 * @param nft
 */
export function buildWearableV1Metadata(nft: NFT): Metadata {
  let representation = getWearableV1Representation(nft)

  let metadata = new Metadata(representation.id)

  let wearable = buildWearableV1(nft, representation)

  metadata.itemType = WEARABLE
  metadata.wearable = wearable.id

  metadata.save()

  return metadata!
}


export function setItemSearchFields(item: Item): Item {
  if (item.itemType == WEARABLE) {
    return setItemWearableSearchFields(item)
  }

  return item
}

export function setNFTSearchFields(nft: NFT): NFT {
  if (nft.itemType == WEARABLE) {
    return setNFTWearableSearchFields(nft)
  }

  return nft
}
