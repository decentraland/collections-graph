import { BigInt, log } from '@graphprotocol/graph-ts'

import { Item, Order } from '../../entities/schema'
import { getCatalystBase } from '../catalyst'
import * as status from '../order'

export function getItemId(contractAddress: string, itemId: string): string {
  return contractAddress + '-' + itemId
}

export function getItemImage(item: Item): string {
  let baseURI = getCatalystBase()

  return baseURI + '/lambdas/collections/contents/' + item.urn + '/thumbnail'
}

export function removeItemMinter(item: Item, minter: string): Array<string> {
  let newMinters = new Array<string>(0)
  let minters = item.minters

  for (let i = 0; i < minters.length; i++) {
    if (minters[i] != minter) {
      newMinters.push(minters[i])
    }
  }

  return newMinters
}

export function updateItemOrderData(item: Item, order: Order): void {
  let orders = item.nftOrderPrices
  if (order.status == status.OPEN) {
    if (item.minNftOrder === null) {
      item.minNftOrder = order.price
    }
    if (item.maxNftOrder === null) {
      item.maxNftOrder = order.price
    }

    if (orders.length > 0) {
      let indexOfGreaterValue = -1
      for (let i = 0; i < orders.length; ++i) {
        if (orders[i] > order.price) {
          indexOfGreaterValue = i
          break
        }
      }
      log.info('Open order for itemId: {}, order price: {} at index {},  orders: {}', [
        item.id.toString(),
        order.price.toString(),
        indexOfGreaterValue.toString(),
        item.nftOrderPrices.join(',')
      ])

      if (indexOfGreaterValue == 0) {
        item.minNftOrder = order.price
        orders.unshift(order.price)
      } else if (indexOfGreaterValue > 0) {
        let end = orders.slice(indexOfGreaterValue)
        orders = orders
          .slice(0, indexOfGreaterValue)
          .concat([order.price])
          .concat(end)
      } else {
        orders.push(order.price)
        item.maxNftOrder = order.price
      }
    } else {
      orders = [order.price]
    }
    item.nftOpenOrdersCount += 1
  } else {
    // find element in the array
    let indexOfOrderValue = -1
    for (let i = 0; i < orders.length; ++i) {
      if (orders[i] == order.price) {
        indexOfOrderValue = i
        break
      }
    }
    log.info('Order value to remove for itemId: {}, order price: {} at index {},  orders: {}, order.status: {}', [
      item.id.toString(),
      order.price.toString(),
      indexOfOrderValue.toString(),
      item.nftOrderPrices.join(','),
      order.status
    ])

    if (indexOfOrderValue >= 0) {
      orders.splice(indexOfOrderValue, 1)
    }

    // update min
    if (item.minNftOrder == order.price) {
      if (orders.length == 0) {
        item.minNftOrder = BigInt.fromI32(0)
      } else {
        item.minNftOrder = orders[0]
      }
    }

    // update max
    if (item.maxNftOrder == order.price) {
      if (orders.length == 0) {
        item.maxNftOrder = BigInt.fromI32(0)
      } else {
        item.maxNftOrder = orders[orders.length - 1]
      }
    }
    item.nftOpenOrdersCount -= 1
  }

  item.nftOrderPrices = orders
  if (item.available && item.minNftOrder) {
    let min = item.price > item.minNftOrder ? item.minNftOrder : item.price
    item.minPrice = min
  } else if (item.minNftOrder) {
    item.minPrice = item.minNftOrder
  }
  item.save()
}
