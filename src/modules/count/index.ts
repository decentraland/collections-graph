import { BigInt } from '@graphprotocol/graph-ts'
import { Count } from '../../entities/schema'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.orderTotal = 0
    count.bidTotal = 0
    count.collectionTotal = 0
    count.itemTotal = 0
    count.nftTotal = 0
    count.salesTotal = 0
    count.salesManaTotal = BigInt.fromI32(0)
    count.primarySalesTotal = 0
    count.primarySalesManaTotal = BigInt.fromI32(0)
    count.secondarySalesTotal = 0
    count.secondarySalesManaTotal = BigInt.fromI32(0)
    count.started = 0
  }

  return count as Count
}

export function buildCountFromNFT(): Count {
  let count = buildCount()

  count.nftTotal += 1

  return count
}

export function buildCountFromItem(): Count {
  let count = buildCount()

  count.itemTotal += 1

  return count
}

export function buildCountFromCollection(): Count {
  let count = buildCount()

  count.collectionTotal += 1

  return count
}

export function buildCountFromOrder(): Count {
  let count = buildCount()

  count.orderTotal += 1

  return count
}

export function buildCountFromBid(): Count {
  let count = buildCount()

  count.bidTotal += 1

  return count
}

export function buildCountFromPrimarySale(price: BigInt): Count {
  let count = buildCount()
  count.primarySalesTotal += 1
  count.primarySalesManaTotal = count.primarySalesManaTotal.plus(price)
  return count
}

export function buildCountFromSecondarySale(price: BigInt): Count {
  let count = buildCount()
  count.secondarySalesTotal += 1
  count.secondarySalesManaTotal = count.secondarySalesManaTotal.plus(price)
  return count
}

export function buildCountFromSale(price: BigInt): Count {
  let count = buildCount()
  count.salesTotal += 1
  count.salesManaTotal = count.salesManaTotal.plus(price)
  return count
}
