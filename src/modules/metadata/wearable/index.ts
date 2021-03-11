import { log } from '@graphprotocol/graph-ts'

import * as categories from './categories'
import { Collection, Item, NFT, Metadata, Wearable } from '../../../entities/schema'
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
  halloween_2020,
  xmas_2020,
  xmash_up_2020,
  release_the_kraken,
  threelau_basics,
  meme_dontbuythis,
  ml_liondance,
  atari_launch,
  rtfkt_x_atari,
  rac_basics,
  winklevoss_capital,
  wearable_test,
} from '../../../data/wearablesV1'
import { getNetwork } from '../../Network'
import { toLowerCase } from '../../../utils'


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

export function buildWearableV1(item: Item, representation: WearableRepresentation): Wearable {
  let wearable = new Wearable(representation.id)

  wearable.collection = item.collection
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

  item.searchText = toLowerCase(wearable.name + ' ' + wearable.description)
  item.searchItemType = item.itemType
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

  nft.searchText = toLowerCase(wearable.name + ' ' + wearable.description)
  nft.searchItemType = nft.itemType
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
export function getWearableV1Image(collection: Collection, item: Item, wearable: string): string {
  let collectionName = collection.name.split('//')

  // Mainnet collections v1. Example dcl://halloween_2019
  if (collectionName.length == 2) {
    return 'https://wearable-api.decentraland.org/v2/collections/' +
      collectionName[1] +
      '/wearables/' +
      wearable +
      '/thumbnail'
  }

  // Ropsten collections v1
  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask
  let itemURI = item.URI.split('/')
  if (itemURI.length == 10) {
    return 'https://wearable-api.decentraland.org/v2/collections/' +
      itemURI[itemURI.length - 3] +
      '/wearables/' +
      wearable +
      '/thumbnail'
  }


  return ''
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
    halloween_2020,
    xmas_2020,
    xmash_up_2020,
    release_the_kraken,
    threelau_basics,
    meme_dontbuythis,
    ml_liondance,
    atari_launch,
    rtfkt_x_atari,
    rac_basics,
    winklevoss_capital,
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


export function getIssuedIdFromTokenURI(tokenURI: string): number {
  let splitted = tokenURI.split('/')

  // https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/halloween_2019/wearables/funny_skull_mask/1
  // or
  // dcl://halloween_2019/vampire_feet/55
  if (splitted.length == 11 || splitted.length == 5) {
    let issuedId = splitted.slice(-1)
    return parseInt(issuedId[0], 10)
  }

  return 0
}

let baseDecentralandURN = 'urn:decentraland:'

export function getURNForWearableV1(collection: Collection, representationId: string): string {
  let collectionName = collection.name.split('dcl://')
  return baseDecentralandURN + getNetwork() + ':collections-v1:' + (collectionName.length > 1 ? collectionName[1] : collectionName[0]) + ':' + representationId

}

export function getURNForWearableV2(collectionAddress: string, itemId: string): string {
  return baseDecentralandURN + getNetwork() + ':collections-v2:' + collectionAddress + ':' + itemId
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