import { BigInt } from '@graphprotocol/graph-ts'
import { CollectorsDayData, Item, Sale } from '../../entities/schema'

// CollectorsDayData
export function getOrCreateCollectorsDayData(timestamp: BigInt, collector: string): CollectorsDayData {
  let dayID = timestamp.toI32() / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400
  let collectorsDayDataId = dayID.toString() + '-' + collector

  let collectorsDayData = CollectorsDayData.load(collectorsDayDataId)
  if (collectorsDayData === null) {
    collectorsDayData = new CollectorsDayData(collectorsDayDataId)
    collectorsDayData.date = dayStartTimestamp // unix timestamp for start of day
    collectorsDayData.purchases = 0
    collectorsDayData.creatorsSupported = []
    collectorsDayData.uniqueItems = []
    collectorsDayData.volume = BigInt.fromI32(0)
  }

  return collectorsDayData as CollectorsDayData
}

export function updateCollectorsDayData(sale: Sale, item: Item): CollectorsDayData {
  let collectorsDayData = getOrCreateCollectorsDayData(sale.timestamp, sale.buyer.toHex())
  collectorsDayData.purchases += 1
  collectorsDayData.volume = collectorsDayData.volume.plus(sale.price)

  // track unique items
  if (item.rarity == 'unique') {
    let uniqueItems = new Set<string>()
    for (let i = 0; i < collectorsDayData.uniqueItems.length; i++) {
      uniqueItems.add(collectorsDayData.uniqueItems[i])
    }
    uniqueItems.add(item.id)
    // @ts-ignore - uniqueItems.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
    collectorsDayData.uniqueItems = uniqueItems.values()
  }

  // track collectors supported
  let uniqueCreatorsSupported = new Set<string>()
  for (let i = 0; i < collectorsDayData.creatorsSupported.length; i++) {
    uniqueCreatorsSupported.add(collectorsDayData.creatorsSupported[i])
  }
  uniqueCreatorsSupported.add(sale.seller.toHex())
  // @ts-ignore - creatorsSupported.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
  collectorsDayData.creatorsSupported = uniqueCreatorsSupported.values()

  return collectorsDayData as CollectorsDayData
}
