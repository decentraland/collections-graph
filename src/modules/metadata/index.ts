import * as itemTypes from './itemTypes'
import { Item, NFT, Metadata } from '../../entities/schema'
import { setNFTWearableSearchFields, setItemWearableSearchFields, buildWearableItem, buildWearableV1 } from './wearable'
import { Wearable as WearableRepresentation } from '../../data/wearablesV1'
import { buildEmoteItem, setItemEmoteSearchFields, setNFTEmoteSearchFields } from './emote'
import { log } from '@graphprotocol/graph-ts'

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

    switch (type) {
      case itemTypes.WEARABLE_TYPE_SHORT: {
        let wearable = buildWearableItem(item)
        metadata.itemType = itemTypes.WEARABLE_V2
        metadata.wearable = wearable.id
        break
      }
      case itemTypes.SMART_WEARABLE_TYPE_SHORT: {
        let wearable = buildWearableItem(item)
        metadata.itemType = itemTypes.SMART_WEARABLE_V1
        metadata.wearable = wearable.id
        break
      }
      case itemTypes.EMOTE_TYPE_SHORT: {
        let emote = buildEmoteItem(item)
        metadata.itemType = itemTypes.EMOTE_V1
        metadata.emote = emote.id
        break
      }
      default: {
        metadata.itemType = itemTypes.UNDEFINED
      }
    }
  } else {
    metadata.itemType = itemTypes.UNDEFINED
  }

  metadata.save()

  return metadata!
}

export function buildWearableV1Metadata(item: Item, representation: WearableRepresentation): Metadata {
  let metadata = new Metadata(representation.id)

  let wearable = buildWearableV1(item, representation)

  metadata.itemType = itemTypes.WEARABLE_V1
  metadata.wearable = wearable.id

  metadata.save()

  return metadata!
}

export function setItemSearchFields(item: Item): Item {
  if (item.itemType == itemTypes.WEARABLE_V2 || item.itemType == itemTypes.WEARABLE_V1 || item.itemType == itemTypes.SMART_WEARABLE_V1) {
    return setItemWearableSearchFields(item)
  }
  if (item.itemType == itemTypes.EMOTE_V1) {
    return setItemEmoteSearchFields(item)
  }

  return item
}

export function setNFTSearchFields(nft: NFT): NFT {
  if (nft.itemType == itemTypes.WEARABLE_V2 || nft.itemType == itemTypes.WEARABLE_V1 || nft.itemType == itemTypes.SMART_WEARABLE_V1) {
    return setNFTWearableSearchFields(nft)
  }

  if (nft.itemType == itemTypes.EMOTE_V1) {
    return setNFTEmoteSearchFields(nft)
  }

  return nft
}

export function isValidBodyShape(bodyShapes: string[]): boolean {
  for (let i = 0; i++; i < bodyShapes.length) {
    let bodyShape = bodyShapes[i]
    if (bodyShape != 'BaseFemale' && bodyShape != 'BaseMale') {
      log.error('Invalid BodyShape {}', [bodyShape])
      return false
    }
  }

  return true
}
