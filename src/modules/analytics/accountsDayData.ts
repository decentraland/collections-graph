import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { MINT_SALE_TYPE } from '.'
import { AccountsDayData, Item, Sale } from '../../entities/schema'

// AccountsDayData
export function getOrCreateAccountsDayData(timestamp: BigInt, address: string): AccountsDayData {
  let dayID = timestamp.toI32() / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400
  let accountsDayDataId = dayID.toString() + '-' + address

  let accountsDayData = AccountsDayData.load(accountsDayDataId)
  if (accountsDayData === null) {
    accountsDayData = new AccountsDayData(accountsDayDataId)
    accountsDayData.date = dayStartTimestamp // unix timestamp for start of day
    accountsDayData.earned = BigInt.fromI32(0)
    accountsDayData.spent = BigInt.fromI32(0)
    // for creators
    accountsDayData.sales = 0
    accountsDayData.uniqueCollectionsSales = []
    accountsDayData.uniqueCollectors = []
    accountsDayData.uniqueCollectorsTotal = 0
    // for collectors
    accountsDayData.purchases = 0
    accountsDayData.creatorsSupported = []
    accountsDayData.creatorsSupportedTotal = 0
    accountsDayData.uniqueAndMythicItems = []
    accountsDayData.uniqueAndMythicItemsTotal = 0
  }

  return accountsDayData as AccountsDayData
}

export function updateBuyerAccountsDayData(sale: Sale, item: Item): AccountsDayData {
  let buyerAccountsDayData = getOrCreateAccountsDayData(sale.timestamp, sale.buyer.toHex())

  // update buyer/collector day data
  buyerAccountsDayData.purchases += 1
  buyerAccountsDayData.spent = buyerAccountsDayData.spent.plus(sale.price)

  // track unique and mythic items
  if (item.rarity == 'unique' || item.rarity == 'mythic') {
    buyerAccountsDayData.uniqueAndMythicItems = updateUniqueAndMythicItemsSet(buyerAccountsDayData.uniqueAndMythicItems, item)
    buyerAccountsDayData.uniqueAndMythicItemsTotal = buyerAccountsDayData.uniqueAndMythicItems.length
  }
  // track creators supported
  buyerAccountsDayData.creatorsSupported = updateCreatorsSupportedSet(buyerAccountsDayData.creatorsSupported, sale.seller)
  buyerAccountsDayData.creatorsSupportedTotal = buyerAccountsDayData.creatorsSupported.length

  return buyerAccountsDayData as AccountsDayData
}

export function updateCreatorAccountsDayData(sale: Sale, earned: BigInt, collectionId: string): AccountsDayData {
  let creatorAccountsDayData = getOrCreateAccountsDayData(sale.timestamp, sale.seller.toHex())

  // update seller/creator day data
  creatorAccountsDayData.earned = creatorAccountsDayData.earned.plus(earned)
  // for mints, track the number of unique collectors
  if (sale.type == MINT_SALE_TYPE) {
    creatorAccountsDayData.sales += 1
    creatorAccountsDayData.uniqueCollectionsSales = updateUniqueCollectionsSalesSet(creatorAccountsDayData.uniqueCollectionsSales, collectionId)
    creatorAccountsDayData.uniqueCollectors = updateUniqueCollectorsSet(creatorAccountsDayData.uniqueCollectors, sale.buyer)
    creatorAccountsDayData.uniqueCollectorsTotal = creatorAccountsDayData.uniqueCollectors.length
  }

  return creatorAccountsDayData as AccountsDayData
}

export function updateUniqueAndMythicItemsSet(uniqueAndMythicItems: string[], item: Item): string[] {
  let updatedUniqueAndMythicItems = new Set<string>()
  for (let i = 0; i < uniqueAndMythicItems.length; i++) {
    updatedUniqueAndMythicItems.add(uniqueAndMythicItems[i])
  }
  updatedUniqueAndMythicItems.add(item.id)
  // @ts-ignore - uniqueAndMythicItems.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
  return updatedUniqueAndMythicItems.values()
}

export function updateCreatorsSupportedSet(creatorsSupported: string[], seller: Bytes): string[] {
  let uniqueCreatorsSupported = new Set<string>()
  for (let i = 0; i < creatorsSupported.length; i++) {
    uniqueCreatorsSupported.add(creatorsSupported[i])
  }
  uniqueCreatorsSupported.add(seller.toHex())
  // @ts-ignore - uniqueCreatorsSupported.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
  return uniqueCreatorsSupported.values()
}

export function updateUniqueCollectorsSet(collectors: string[], buyer: Bytes): string[] {
  let uniqueCollectors = new Set<string>()
  for (let i = 0; i < collectors.length; i++) {
    uniqueCollectors.add(collectors[i])
  }
  uniqueCollectors.add(buyer.toHex())
  // @ts-ignore - uniqueCollectors.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
  return uniqueCollectors.values()
}

export function updateUniqueCollectionsSalesSet(uniqueCollectionsSales: string[], collectionId: string): string[] {
  let uniqueCollectionsSalesSet = new Set<string>()
  for (let i = 0; i < uniqueCollectionsSales.length; i++) {
    uniqueCollectionsSalesSet.add(uniqueCollectionsSales[i])
  }
  uniqueCollectionsSalesSet.add(collectionId)
  // @ts-ignore - uniqueCollectionsSalesSet.values() returns an Array<string> and not an IterableIterator<string> as the IDE suggests
  return uniqueCollectionsSalesSet.values()
}
