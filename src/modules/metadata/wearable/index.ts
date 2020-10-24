import { log } from '@graphprotocol/graph-ts'

import * as categories from './categories'
import { Item, NFT, Metadata, Wearable } from '../../../entities/schema'
import {
  Wearable as WearableRepresentation,
  binance_us_collection,
  china_flying,
  community_contest,
  cybermike_cybersoldier_set,
  cz_mercenary_mtz,
  dappcraft_moonminer,
  dc_meta,
  dc_niftyblocksmith,
  dcg_collection,
  dcl_launch,
  dg_fall_2020,
  dg_summer_2020,
  dgtble_headspace,
  digital_alchemy,
  ethermon_wearables,
  exclusive_masks,
  halloween_2019,
  mch_collection,
  mf_sammichgamer,
  ml_pekingopera,
  moonshot_2020,
  pm_dreamverse_eminence,
  pm_outtathisworld,
  stay_safe,
  sugarclub_yumi,
  tech_tribal_marc0matic,
  wonderzone_meteorchaser,
  wonderzone_steampunk,
  wz_wonderbot,
  xmas_2019,
  wearable_test
} from '../../../data/wearablesV1'

/**
 * @dev The item's rawMetadata for wearables should follow: version:item_type:name:description:category:bodyshapes
 * @param item
 */
export function buildWearableItem(item: Item): Wearable {
  let id = item.id
  let data = item.rawMetadata.split(':')

  let wearable = Wearable.load(id)

  if (wearable == null) {
    wearable = new Wearable(id)
  }

  if (data.length >= 6) {
    wearable.collection = item.collection
    wearable.name = data[2]
    wearable.description = data[3]
    wearable.rarity = item.rarity
    wearable.category = data[4]
    wearable.bodyShapes = data[5].split(',') // Could be more than one
  }

  wearable.save()

  return wearable!
}

export function buildWearableV1(nft: NFT, representation: WearableRepresentation): Wearable {
  let wearable = new Wearable(representation.id)

  wearable.collection = nft.collection
  wearable.name = representation.name
  wearable.description = representation.description
  wearable.rarity = representation.rarity
  wearable.category = representation.category
  wearable.bodyShapes = representation.bodyShapes

  wearable.save()

  return wearable
}

export function setItemWearableSearchFields(item: Item): Item {
  let metadata = Metadata.load(item.metadata)
  let wearable = Wearable.load(metadata.wearable)

  item.searchText = wearable.name + ' ' + wearable.description
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

  nft.searchText = wearable.name + ' ' + wearable.description
  nft.searchIsWearableHead = isWearableHead(wearable.category)
  nft.searchIsWearableAccessory = isWearableAccessory(wearable.category)
  nft.searchWearableCategory = wearable.category
  nft.searchWearableBodyShapes = wearable.bodyShapes
  nft.searchWearableRarity = wearable.rarity

  return nft
}

export function isWearableHead(category: string): boolean {
  return (
    category == categories.EYEBROWS ||
    category == categories.EYES ||
    category == categories.FACIAL_HAIR ||
    category == categories.HAIR ||
    category == categories.MOUTH
  )
}

export function isWearableAccessory(category: string): boolean {
  return (
    category == categories.EARRING ||
    category == categories.EYEWEAR ||
    category == categories.HAT ||
    category == categories.HELMET ||
    category == categories.MASK ||
    category == categories.TIARA ||
    category == categories.TOP_HEAD
  )
}

// Wearable V1 methods
export function getWearableV1Image(collection: string, representationId: string): string {
  return (
    'https://wearable-api.decentraland.org/v2/collections/' +
    collection +
    '/wearables/' +
    representationId +
    '/thumbnail'
  )
}

export function getWearableV1Representation(wearableId: string): WearableRepresentation {
  if (wearableId == '') {
    log.error('Coud not get a wearable id', [])
    return null
  }

  let allCollections: WearableRepresentation[][] = [
    binance_us_collection,
    china_flying,
    community_contest,
    cybermike_cybersoldier_set,
    cz_mercenary_mtz,
    dappcraft_moonminer,
    dc_meta,
    dc_niftyblocksmith,
    dcg_collection,
    dcl_launch,
    dg_fall_2020,
    dg_summer_2020,
    dgtble_headspace,
    digital_alchemy,
    ethermon_wearables,
    exclusive_masks,
    halloween_2019,
    mch_collection,
    mf_sammichgamer,
    ml_pekingopera,
    moonshot_2020,
    pm_dreamverse_eminence,
    pm_outtathisworld,
    stay_safe,
    sugarclub_yumi,
    tech_tribal_marc0matic,
    wonderzone_meteorchaser,
    wonderzone_steampunk,
    wz_wonderbot,
    xmas_2019,
    wearable_test
  ]

  for (let i = 0; i < allCollections.length; i++) {
    let wearable = findWearable(wearableId, allCollections[i])
    if (wearable.id == wearableId) {
      return wearable
    }
  }

  log.error(
    'Coud not find a wearable for the id {}',
    [wearableId]
  )
  return null
}

export function getWearableIdFromTokenURI(tokenURI: string): string {
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
