import { log } from '@graphprotocol/graph-ts'
import { isValidBodyShape } from '..'
import { Emote, Item, Metadata, NFT } from '../../../entities/schema'
import { toLowerCase } from '../../../utils'
import { DANCE, FUN, GREETINGS, HORROR, MISCELLANEOUS, POSES, REACTIONS, STUNT } from './categories'
import { LOOP, SIMPLE } from './playModes'

/**
 * @dev The item's rawMetadata for emotes should follow: version:item_type:name:description:category:bodyshapes:play_mode
 * @param item
 */
export function buildEmoteItem(item: Item): Emote | null {
  let id = item.id
  let data = item.rawMetadata.split(':')
  let dataHasValidLength = data.length == 6 || data.length == 8 || data.length == 9
  if (dataHasValidLength && isValidBodyShape(data[5].split(','))) {
    let emote = Emote.load(id)

    if (emote == null) {
      emote = new Emote(id)
    }

    emote.collection = item.collection
    emote.name = data[2]
    emote.description = data[3]
    emote.rarity = item.rarity
    emote.category = isValidEmoteCategory(data[4]) ? data[4] : DANCE // We're using DANCE as fallback to support the emotes that were created with the old categories.
    emote.bodyShapes = data[5].split(',') // Could be more than one
    emote.playMode = data.length == 9 && isValidEmotePlayMode(data[6]) ? data[6] : SIMPLE
    emote.save()

    return emote
  }

  return null
}

function isValidEmoteCategory(category: string): boolean {
  if (
    category == DANCE ||
    category == STUNT ||
    category == GREETINGS ||
    category == FUN ||
    category == POSES ||
    category == REACTIONS ||
    category == HORROR ||
    category == MISCELLANEOUS
  ) {
    return true
  }

  log.error('Invalid Category {}', [category])

  return false
}

function isValidEmotePlayMode(playMode: string): boolean {
  if (playMode == SIMPLE || playMode === LOOP) {
    return true
  }

  log.error('Invalid emote play mode {}', [playMode])

  return false
}

export function setItemEmoteSearchFields(item: Item): Item {
  if (!item.metadata) {
    return item
  }
  let metadata = Metadata.load(item.metadata!)
  if (metadata != null) {
    let emote = Emote.load(metadata.emote!)
    if (emote != null) {
      item.searchText = toLowerCase(emote.name + ' ' + emote.description)
      item.searchEmoteCategory = emote.category
      item.searchEmotePlayMode = emote.playMode
      item.searchEmoteBodyShapes = emote.bodyShapes
      item.searchEmoteRarity = emote.rarity
    }
    item.searchItemType = item.itemType
  }

  return item
}

export function setNFTEmoteSearchFields(nft: NFT): NFT {
  if (!nft.metadata) {
    return nft
  }
  let metadata = Metadata.load(nft.metadata!) as Metadata
  if (metadata != null) {
    let emote = Emote.load(metadata.emote!) as Emote
    if (emote) {
      nft.searchText = toLowerCase(emote.name + ' ' + emote.description)
      nft.searchEmoteCategory = emote.category
      nft.searchEmotePlayMode = emote.playMode
      nft.searchEmoteBodyShapes = emote.bodyShapes
      nft.searchEmoteRarity = emote.rarity
    }
    nft.searchItemType = nft.itemType
  }

  return nft
}
