import { log } from '@graphprotocol/graph-ts'

import { Item, NFT, Metadata, Wearable } from '../../entities/schema'
import {
  Wearable as WearableRepresentation, community_contest,
  dappcraft_moonminer,
  dcg_collection,
  dcl_launch,
  dg_summer_2020,
  dgtble_headspace,
  exclusive_masks,
  halloween_2019,
  mch_collection,
  moonshot_2020,
  pm_outtathisworld,
  stay_safe,
  wonderzone_meteorchaser,
  xmas_2019
} from '../../data/wearablesV1'

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
 * @dev The rawMetadata for wearables should follow: version:type:name:category:bodyshapes
 *
 * @param rawMetadata
 */
export function buildWearableItem(item: Item): Wearable {
  let id = item.id
  let data = item.rawMetadata.split(':')

  let wearable = Wearable.load(id)

  if (wearable == null) {
    wearable = new Wearable(id)
  }

  if (data.length >= 5) {
    wearable.collection = item.collection
    wearable.representationId = data[2]
    wearable.rarity = item.rarity
    wearable.category = data[3]
    wearable.bodyShapes = data[4].split(',') // Could be more than one
  }

  wearable.save()

  return wearable!
}

/**
 * @param nft
 */
export function buildWearableV1(nft: NFT, representation: WearableRepresentation): Wearable {
  let wearable = new Wearable(representation.id)

  wearable.collection = nft.collection
  wearable.representationId = representation.id
  wearable.rarity = representation.rarity
  wearable.category = representation.category
  wearable.bodyShapes = representation.bodyShapes

  wearable.save()

  return wearable
}

export function setItemWearableSearchFields(item: Item): Item {
  let metadata = Metadata.load(item.metadata)
  let wearable = Wearable.load(metadata.wearable)

  item.searchIsWearableHead = isWearableHead(wearable.category)
  item.searchIsWearableAccessory = isWearableAccessory(wearable.category)
  item.searchWearableCategory = wearable.category
  item.searchWearableBodyShapes = wearable.bodyShapes
  item.searchWearableRarity = wearable.rarity

  return item
}

export function setNFTWearableSearchFields(nft: NFT): NFT {
  let metadata = Metadata.load(nft.metadata)
  let wearable = Wearable.load(metadata.wearable)

  nft.searchIsWearableHead = isWearableHead(wearable.category)
  nft.searchIsWearableAccessory = isWearableAccessory(wearable.category)
  nft.searchWearableCategory = wearable.category
  nft.searchWearableBodyShapes = wearable.bodyShapes
  nft.searchWearableRarity = wearable.rarity

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

// Wearable V1 methods
export function getWearableV1Image(wearable: Wearable): string {
  return (
    'https://wearable-api.decentraland.org/v2/collections/' +
    wearable.collection +
    '/wearables/' +
    wearable.representationId +
    '/thumbnail'
  )
}


export function getWearableV1Representation(nft: NFT): WearableRepresentation {
  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  let wearableId = getWearableIdFromTokenURI(nft.tokenURI)

  if (wearableId == '') {
    log.error('Coud not get a wearable id from tokenURI {} and nft {}', [
      nft.tokenURI,
      nft.id
    ])
    return null
  }

  let allCollections: WearableRepresentation[][] = [
    community_contest,
    dappcraft_moonminer,
    dcg_collection,
    dcl_launch,
    dg_summer_2020,
    dgtble_headspace,
    exclusive_masks,
    halloween_2019,
    mch_collection,
    moonshot_2020,
    pm_outtathisworld,
    stay_safe,
    wonderzone_meteorchaser,
    xmas_2019
  ]

  for (let i = 0; i < allCollections.length; i++) {
    let wearable = findWearable(wearableId, allCollections[i])
    if (wearable.id == wearableId) {
      return wearable
    }
  }

  log.error(
    'Coud not find a wearable for the id {} found on the tokenURI {} and nft {}',
    [wearableId, nft.tokenURI, nft.id]
  )
  return null
}

function getWearableIdFromTokenURI(tokenURI: string): string {
  let splitted = tokenURI.split('/')

  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  // or
  // dcl://halloween_2019/vampire_feet/55
  if (splitted.length == 11 || splitted.length == 5) {
    let ids = splitted.slice(-2)
    return ids[0]
  }

  return ''
}

function findWearable(id: string, collection: WearableRepresentation[]): WearableRepresentation {
  for (let i = 0; i < collection.length; i++) {
    let wearable = collection[i]
    if (id == wearable.id) {
      return wearable
    }
  }

  return null
}
