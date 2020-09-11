import { Count } from '../../entities/schema'

export const DEFAULT_ID = 'all'

export function buildCount(): Count {
  let count = Count.load(DEFAULT_ID)

  if (count == null) {
    count = new Count(DEFAULT_ID)
    count.orderTotal = 0
    count.collectionTotal = 0
    count.itemTotal = 0
    count.nftTotal = 0
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