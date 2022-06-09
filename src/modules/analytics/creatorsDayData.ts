import { BigInt } from '@graphprotocol/graph-ts'
import { MINT_SALE_TYPE } from '.'
import { CreatorsDayData, Sale } from '../../entities/schema'

// CreatorsDayData
export function getOrCreateCreatorsDayData(timestamp: BigInt, creator: string): CreatorsDayData {
  let dayID = timestamp.toI32() / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400
  let creatorsDayDataId = dayID.toString() + '-' + creator

  let creatorsDayData = CreatorsDayData.load(creatorsDayDataId)
  if (creatorsDayData === null) {
    creatorsDayData = new CreatorsDayData(creatorsDayDataId)
    creatorsDayData.date = dayStartTimestamp // unix timestamp for start of day
    creatorsDayData.sales = 0
    creatorsDayData.collections = 0
    creatorsDayData.uniqueCollectors = []
    creatorsDayData.volume = BigInt.fromI32(0)
  }

  return creatorsDayData as CreatorsDayData
}

export function updateCreatorsDayData(sale: Sale): CreatorsDayData {
  let creatorsDayData = getOrCreateCreatorsDayData(sale.timestamp, sale.seller.toHex())
  creatorsDayData.sales += 1
  creatorsDayData.volume = creatorsDayData.volume.plus(sale.price)

  // for mints, track the number of unique collectors
  if (sale.type == MINT_SALE_TYPE) {
    let uniqueCollectors = new Set<string>()
    for (let i = 0; i < creatorsDayData.uniqueCollectors.length; i++) {
      uniqueCollectors.add(creatorsDayData.uniqueCollectors[i])
    }
    uniqueCollectors.add(sale.buyer.toHex())
    // @ts-ignore - uniqueCollectors.values() returns an Array<string> and not an IterableIterator<string> as it expects
    creatorsDayData.uniqueCollectors = uniqueCollectors.values()
  }

  return creatorsDayData as CreatorsDayData
}

export function buildCreatorsDayDataFromCollection(timestamp: BigInt, creator: string): CreatorsDayData {
  let creatorsDayData = getOrCreateCreatorsDayData(timestamp, creator)

  creatorsDayData.collections += 1

  return creatorsDayData as CreatorsDayData
}
