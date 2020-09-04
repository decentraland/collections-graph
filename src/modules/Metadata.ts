import { Item, NFT, Metadata } from '../entities/schema'

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
export const WEARABLE_OLD_TYPE_SHORT = 'old_w'
export const WEARABLE_TYPE_SHORT = 'w'


/**
 * @dev The rawMetadata should be: version:type:name:data
 *
 * @param rawMetadata
 */
export function getItemMetadata(rawMetadata: string): Metadata {
  let data = rawMetadata.split(':')
  if (data.length >= 1) {
    let type = data[1]

    if (type == WEARABLE_TYPE_SHORT) {
      return getWearableItemMetadata(rawMetadata)
    }
  }

  return new Metadata(rawMetadata)

}

/**
 * @dev The rawMetadata for wearables should follow: version:type:name:category:bodyshapes
 *
 * @param rawMetadata
 */
function getWearableItemMetadata(rawMetadata: string): Metadata {
  let data = rawMetadata.split(':')

  let metadata = new Metadata(rawMetadata)

  if (data.length >= 3) {
    metadata.name = data[2]
    metadata.type = WEARABLE
    metadata.category = data[3]
    metadata.bodyShapes = data[4].split(',') // Could be more than one
  }

  return metadata
}

export function setItemSearchFields(item: Item): Item {
  if (item.type == WEARABLE) {
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

export function setItemWearableSearchFields(item: Item): Item {
  let metadata = Metadata.load(item.metadata)

  item.searchIsWearableHead = isWearableHead(metadata.category)
  item.searchIsWearableAccessory = isWearableAccessory(metadata.category)
  item.searchWearableCategory = metadata.category
  item.searchWearableBodyShapes = metadata.bodyShapes
  item.searchWearableRarity = item.rarity

  return item
}

export function setNFTWearableSearchFields(nft: NFT): NFT {
  let item = Item.load(nft.item)
  let metadata = Metadata.load(item.metadata)

  nft.searchIsWearableHead = isWearableHead(metadata.category)
  nft.searchIsWearableAccessory = isWearableAccessory(metadata.category)
  nft.searchWearableCategory = metadata.category
  nft.searchWearableBodyShapes = metadata.bodyShapes
  nft.searchWearableRarity = item.rarity

  return nft
}

export function isWearableHead(category: string): boolean {
  return (
    category == EYEBROWS ||
    category == EYES ||
    category == FACIAL_HAIR ||
    category == HAIR ||
    category == MOUTH
  )
}

export function isWearableAccessory(category: string): boolean {
  return (
    category == EARRING ||
    category == EYEWEAR ||
    category == HAT ||
    category == HELMET ||
    category == MASK ||
    category == TIARA ||
    category == TOP_HEAD
  )
}