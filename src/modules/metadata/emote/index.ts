import { log } from '@graphprotocol/graph-ts'
import { isValidBodyShape } from '..'
import { Emote, Item, Metadata, NFT, Wearable } from '../../../entities/schema'
import { toLowerCase } from '../../../utils'
import { LOOP, SIMPLE } from './categories'

/**
 * @dev The item's rawMetadata for emotes should follow: version:item_type:name:description:category:bodyshapes
 * @param item
 */
export function buildEmoteItem(item: Item): Emote | null {
  let id = item.id
  let data = item.rawMetadata.split(':')
  if ((data.length == 6 || data.length == 8) && isValidEmoteCategory(data[4]) && isValidBodyShape(data[5].split(','))) {
    let emote = Emote.load(id)

    if (emote == null) {
      emote = new Emote(id)
    }

    emote.collection = item.collection
    emote.name = data[2]
    emote.description = data[3]
    emote.rarity = item.rarity
    emote.category = data[4]
    emote.bodyShapes = data[5].split(',') // Could be more than one
    emote.save()

    return emote
  }

  return null
}

function isValidEmoteCategory(category: string): boolean {
  if (category == SIMPLE || category == LOOP) {
    return true
  }

  log.error('Invalid Category {}', [category])

  return false
}

export function setItemEmoteSearchFields(item: Item): Item {
  let metadata = Metadata.load(item.metadata)
  let emote = Emote.load(metadata.emote)

  item.searchText = toLowerCase(emote.name + ' ' + emote.description)
  item.searchItemType = item.itemType
  item.searchEmoteCategory = emote.category
  item.searchEmoteBodyShapes = emote.bodyShapes
  item.searchEmoteRarity = emote.rarity

  return item
}

export function setNFTEmoteSearchFields(nft: NFT): NFT {
  let metadata = Metadata.load(nft.metadata)
  let emote = Emote.load(metadata.emote)

  nft.searchText = toLowerCase(emote.name + ' ' + emote.description)
  nft.searchItemType = nft.itemType
  nft.searchEmoteCategory = emote.category
  nft.searchEmoteBodyShapes = emote.bodyShapes
  nft.searchEmoteRarity = emote.rarity

  return nft
}
