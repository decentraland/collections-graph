import { log } from '@graphprotocol/graph-ts'

import * as categories from './categories'
import { Collection, Item, NFT, Metadata, Wearable, Emote } from '../../../entities/schema'
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
  dg_atari_dillon_francis,
  wearable_test
} from '../../../data/wearablesV1'
import { getNetwork } from '../../Network'
import { toLowerCase } from '../../../utils'
import { isValidBodyShape } from '..'

/**
 * @dev The item's rawMetadata for wearables should follow: version:item_type:name:description:category:bodyshapes
 * If the item has been rescues, the metadata could be be version:item_type:name:description:category:bodyshapes:prev_hash:new_entity_timestamp
 * @param item
 */
export function buildWearableItem(item: Item): Wearable | null {
  let id = item.id
  let data = item.rawMetadata.split(':')
  if ((data.length == 6 || data.length == 8) && isValidWearableCategory(data[4]) && isValidBodyShape(data[5].split(','))) {
    let wearable = Wearable.load(id)

    if (wearable == null) {
      wearable = new Wearable(id)
    }

    wearable.collection = item.collection
    wearable.name = data[2]
    wearable.description = data[3]
    wearable.rarity = item.rarity
    wearable.category = data[4]
    wearable.bodyShapes = data[5].split(',') // Could be more than one
    wearable.save()

    return wearable
  }

  return null
}

function isValidWearableCategory(category: string): boolean {
  if (
    category == 'eyebrows' ||
    category == 'eyes' ||
    category == 'facial_hair' ||
    category == 'hair' ||
    category == 'mouth' ||
    category == 'upper_body' ||
    category == 'lower_body' ||
    category == 'feet' ||
    category == 'earring' ||
    category == 'eyewear' ||
    category == 'hat' ||
    category == 'helmet' ||
    category == 'mask' ||
    category == 'tiara' ||
    category == 'top_head' ||
    category == 'skin'
  ) {
    return true
  }

  log.error('Invalid Category {}', [category])

  return false
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
  if (!item.metadata) {
    return item
  }
  let metadata = Metadata.load(item.metadata!)
  if (metadata != null && metadata.wearable != null) {
    let wearable = Wearable.load(metadata.wearable!)
    if (wearable != null) {
      item.searchText = toLowerCase(wearable.name + ' ' + wearable.description)
      item.searchIsWearableHead = isWearableHead(wearable.category)
      item.searchIsWearableAccessory = isWearableAccessory(wearable.category)
      item.searchWearableCategory = wearable.category
      item.searchWearableBodyShapes = wearable.bodyShapes
      item.searchWearableRarity = wearable.rarity
    }
    item.searchItemType = item.itemType
  }

  return item
}

export function setNFTWearableSearchFields(nft: NFT): NFT {
  if (!nft.metadata) {
    return nft
  }
  let metadata = Metadata.load(nft.metadata!)
  if (metadata != null && metadata.wearable != null) {
    let wearable = Wearable.load(metadata.wearable!)

    if (wearable) {
      nft.searchText = toLowerCase(wearable.name + ' ' + wearable.description)
      nft.searchItemType = nft.itemType
      nft.searchIsWearableHead = isWearableHead(wearable.category)
      nft.searchIsWearableAccessory = isWearableAccessory(wearable.category)
      nft.searchWearableCategory = wearable.category
      nft.searchWearableBodyShapes = wearable.bodyShapes
      nft.searchWearableRarity = wearable.rarity
    }
  }

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

export function getWearableV1Representation(wearableId: string): WearableRepresentation | null {
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
    dg_atari_dillon_francis,
    wearable_test
  ]

  for (let i = 0; i < allCollections.length; i++) {
    let wearable = findWearable(wearableId, allCollections[i])
    if (wearable != null && wearable.id == wearableId) {
      return wearable
    }
  }

  log.error('Coud not find a wearable for the id {}', [wearableId])
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

export function getURNForCollectionV1(collection: Collection): string {
  let collectionName = collection.name.split('dcl://')
  return baseDecentralandURN + getNetwork() + ':collections-v1:' + (collectionName.length > 1 ? collectionName[1] : collectionName[0])
}

export function getURNForCollectionV2(collectionAddress: string): string {
  return baseDecentralandURN + getNetwork() + ':collections-v2:' + collectionAddress
}

export function getURNForWearableV1(collection: Collection, representationId: string): string {
  return getURNForCollectionV1(collection) + ':' + representationId
}

export function getURNForWearableV2(collectionAddress: string, itemId: string): string {
  return getURNForCollectionV2(collectionAddress) + ':' + itemId
}

function findWearable(id: string, collection: WearableRepresentation[]): WearableRepresentation | null {
  for (let i = 0; i < collection.length; i++) {
    let wearable = collection[i]
    if (id == wearable.id) {
      return wearable
    }
  }

  return null
}
