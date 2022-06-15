import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { Item, NFT, Sale, AnalyticsDayData, ItemsDayData } from '../../entities/schema'
import { createOrLoadAccount, ZERO_ADDRESS } from '../Account'
import {
  buildCountFromEarnings,
  buildCountFromPrimarySale,
  buildCountFromRoyalties,
  buildCountFromSale,
  buildCountFromSecondarySale
} from '../Count'
import { ONE_MILLION } from '../Store'
import * as itemTypes from '../metadata/itemTypes'
import {
  updateBuyerAccountsDayData,
  updateCreatorsSupportedSet,
  updateSellerAccountsDayData,
  updateUniqueAndMythicItemsSet,
  updateUniqueCollectorsSet
} from './accountsDayData'

export let BID_SALE_TYPE = 'bid'
export let ORDER_SALE_TYPE = 'order'
export let MINT_SALE_TYPE = 'mint'

export function trackSale(
  type: string,
  buyer: Address,
  seller: Address,
  itemId: string,
  nftId: string,
  price: BigInt,
  feesCollectorCut: BigInt,
  feesCollector: Address,
  royaltiesCut: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // ignore zero price sales
  if (price.isZero()) {
    return
  }

  // count sale
  let count = buildCountFromSale(price)
  count.save()

  // load entities
  let item = Item.load(itemId)
  let nft = NFT.load(nftId)
  if (!item || !nft) {
    return
  }

  // save sale
  let saleId = BigInt.fromI32(count.salesTotal).toString()
  let sale = new Sale(saleId)
  sale.type = type
  sale.buyer = buyer
  sale.seller = seller
  sale.price = price
  sale.item = itemId
  sale.nft = nftId
  sale.timestamp = timestamp
  sale.txHash = txHash
  sale.searchItemId = item.blockchainId
  sale.searchTokenId = nft.tokenId
  sale.searchContractAddress = nft.contractAddress
  sale.searchCategory = nft.category

  // update Fees
  sale.feesCollector = feesCollector
  sale.royaltiesCollector = Address.fromString(ZERO_ADDRESS)
  sale.feesCollectorCut = feesCollectorCut.times(sale.price).div(ONE_MILLION)
  sale.royaltiesCut = royaltiesCut.times(sale.price).div(ONE_MILLION)

  let totalFees = sale.feesCollectorCut.plus(sale.royaltiesCut)

  // count sale
  count = buildCountFromRoyalties(totalFees)
  count.save()

  if (royaltiesCut.gt(BigInt.fromI32(0))) {
    if (item.beneficiary != ZERO_ADDRESS || item.creator != ZERO_ADDRESS) {
      let royaltiesCollectorAddress =
        item.beneficiary != ZERO_ADDRESS ? Address.fromString(item.beneficiary) : Address.fromString(item.creator)

      sale.royaltiesCollector = royaltiesCollectorAddress
      // update royalties collector account
      let royaltiesCollectorAccount = createOrLoadAccount(royaltiesCollectorAddress)
      royaltiesCollectorAccount.earned = royaltiesCollectorAccount.earned.plus(sale.royaltiesCut)
      royaltiesCollectorAccount.royalties = royaltiesCollectorAccount.royalties.plus(sale.royaltiesCut)
      royaltiesCollectorAccount.save()
    } else {
      // If there is not royalties receiver, all the fees goes to the fees collector
      sale.feesCollectorCut = sale.feesCollectorCut.plus(sale.royaltiesCut)
      sale.royaltiesCut = BigInt.fromI32(0)
    }
  }

  // we update the count here because the sale has the updated values based on the royalties reciever
  count = buildCountFromEarnings(
    sale.type == MINT_SALE_TYPE ? sale.price.minus(sale.feesCollectorCut) : sale.royaltiesCut,
    sale.type == MINT_SALE_TYPE ? sale.feesCollectorCut : BigInt.fromI32(0)
  )
  count.save()

  sale.save()

  // update buyer account
  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  if (item.rarity == 'unique' || item.rarity == 'mythic') {
    buyerAccount.uniqueAndMythicItems = updateUniqueAndMythicItemsSet(buyerAccount.uniqueAndMythicItems, item)
    buyerAccount.uniqueAndMythicItemsTotal = buyerAccount.uniqueAndMythicItems.length
  }
  buyerAccount.creatorsSupported = updateCreatorsSupportedSet(buyerAccount.creatorsSupported, sale.seller)
  buyerAccount.creatorsSupportedTotal = buyerAccount.creatorsSupported.length

  buyerAccount.save()

  // update seller account
  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price.minus(totalFees))
  sellerAccount.uniqueCollectors = updateUniqueCollectorsSet(sellerAccount.uniqueCollectors, buyer)
  sellerAccount.uniqueCollectorsTotal = sellerAccount.uniqueCollectors.length

  sellerAccount.save()

  // update fees collector account
  let feesCollectorAccount = createOrLoadAccount(feesCollector)
  feesCollectorAccount.earned = feesCollectorAccount.earned.plus(sale.feesCollectorCut)
  feesCollectorAccount.royalties = feesCollectorAccount.royalties.plus(sale.feesCollectorCut)
  feesCollectorAccount.save()

  // update item
  item.soldAt = timestamp
  item.sales += 1
  item.volume = item.volume.plus(price)
  item.updatedAt = timestamp
  item.uniqueCollectors = updateUniqueCollectorsSet(item.uniqueCollectors, buyer)
  item.uniqueCollectorsTotal = item.uniqueCollectors.length

  item.save()

  // update nft
  nft.soldAt = timestamp
  nft.sales += 1
  nft.volume = nft.volume.plus(price)
  nft.updatedAt = timestamp
  nft.save()

  // track primary sales
  if (type == MINT_SALE_TYPE) {
    let count = buildCountFromPrimarySale(price)
    count.save()
  } else {
    // track secondary sale
    let count = buildCountFromSecondarySale(price)
    count.save()
  }

  let analyticsDayData = updateAnalyticsDayData(sale)
  analyticsDayData.save()

  let itemDayData = updateItemDayData(sale, item)
  itemDayData.save()

  let buyerAccountsDayData = updateBuyerAccountsDayData(sale, item)
  buyerAccountsDayData.save()

  let sellersAccountsDayData = updateSellerAccountsDayData(sale, price.minus(totalFees))
  sellersAccountsDayData.save()
}

// ItemsDayData
export function getOrCreateItemDayData(blockTimestamp: BigInt, itemId: string): ItemsDayData {
  let timestamp = blockTimestamp.toI32()
  let dayID = timestamp / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400

  let itemDayDataId = dayID.toString() + '-' + itemId

  let itemDayData = ItemsDayData.load(itemDayDataId)
  if (itemDayData === null) {
    itemDayData = new ItemsDayData(itemDayDataId)
    itemDayData.date = dayStartTimestamp // unix timestamp for start of day
    itemDayData.sales = 0
    itemDayData.volume = BigInt.fromI32(0)
  }

  return itemDayData as ItemsDayData
}

export function updateItemDayData(sale: Sale, item: Item | null): ItemsDayData {
  let itemDayData = getOrCreateItemDayData(sale.timestamp, sale.item)
  itemDayData.sales += 1
  itemDayData.volume = itemDayData.volume.plus(sale.price)
  if (item != null) {
    itemDayData.searchWearableCategory = item.searchWearableCategory
    itemDayData.searchEmoteCategory = item.searchEmoteCategory
    itemDayData.searchRarity = item.rarity
  }

  return itemDayData as ItemsDayData
}

export function getOrCreateAnalyticsDayData(blockTimestamp: BigInt): AnalyticsDayData {
  let timestamp = blockTimestamp.toI32()
  let dayID = timestamp / 86400 // unix timestamp for start of day / 86400 giving a unique day index
  let dayStartTimestamp = dayID * 86400

  let analyticsDayData = AnalyticsDayData.load(dayID.toString())
  if (analyticsDayData === null) {
    analyticsDayData = new AnalyticsDayData(dayID.toString())
    analyticsDayData.date = dayStartTimestamp // unix timestamp for start of day
    analyticsDayData.sales = 0
    analyticsDayData.volume = BigInt.fromI32(0)
    analyticsDayData.creatorsEarnings = BigInt.fromI32(0)
    analyticsDayData.daoEarnings = BigInt.fromI32(0)
  }
  return analyticsDayData as AnalyticsDayData
}

export function updateAnalyticsDayData(sale: Sale): AnalyticsDayData {
  let analyticsDayData = getOrCreateAnalyticsDayData(sale.timestamp)
  analyticsDayData.sales += 1
  analyticsDayData.volume = analyticsDayData.volume.plus(sale.price)
  analyticsDayData.creatorsEarnings =
    sale.type == MINT_SALE_TYPE
      ? analyticsDayData.creatorsEarnings.plus(sale.price.minus(sale.feesCollectorCut)) // if it's a MINT, the creator earning is the sale price
      : analyticsDayData.creatorsEarnings.plus(sale.royaltiesCut) // if it's a secondary sale, the creator earning is the royaltiesCut (if it's set already)
  analyticsDayData.daoEarnings = analyticsDayData.daoEarnings.plus(sale.feesCollectorCut)

  return analyticsDayData as AnalyticsDayData
}
