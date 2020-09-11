import { log } from '@graphprotocol/graph-ts'
import {
  OrderCreated,
  OrderSuccessful,
  OrderCancelled
} from '../entities/Marketplace/Marketplace'
import { Order, NFT } from '../entities/schema'
import {
  getNFTId,
  updateNFTOrderProperties,
  cancelActiveOrder
} from '../modules/NFT'
import { buildCountFromOrder } from '../modules/Count'
import * as status from '../modules/Order'

export function handleOrderCreated(event: OrderCreated): void {
  let nftId = getNFTId(
    event.params.nftAddress.toHexString(),
    event.params.assetId.toString()
  )

  let orderId = event.params.id.toHex()

  let nft = NFT.load(nftId)
  if (nft == null) {
    log.info('Undefined NFT {} for order {} and address {}', [nftId, orderId, event.params.nftAddress.toHexString()])
    return
  }

  let order = new Order(orderId)
  order.status = status.OPEN
  order.nft = nftId
  order.nftAddress = event.params.nftAddress
  order.txHash = event.transaction.hash
  order.owner = event.params.seller
  order.price = event.params.priceInWei
  order.expiresAt = event.params.expiresAt
  order.blockNumber = event.block.number
  order.createdAt = event.block.timestamp
  order.updatedAt = event.block.timestamp

  order.save()

  cancelActiveOrder(nft!, event.block.timestamp)

  nft = updateNFTOrderProperties(nft!, order)
  nft.save()

  let count = buildCountFromOrder()
  count.save()
}

export function handleOrderSuccessful(event: OrderSuccessful): void {
  let orderId = event.params.id.toHex()

  let order = Order.load(orderId)

  if (order == null) {
    return
  }

  order.status = status.SOLD
  order.buyer = event.params.buyer
  order.price = event.params.totalPrice
  order.blockNumber = event.block.number
  order.updatedAt = event.block.timestamp
  order.save()

  let nftId = getNFTId(
    event.params.nftAddress.toHexString(),
    event.params.assetId.toString()
  )

  let nft = new NFT(nftId)
  nft.owner = event.params.buyer.toHex()
  nft = updateNFTOrderProperties(nft!, order!)
  nft.save()
}

export function handleOrderCancelled(event: OrderCancelled): void {
  let orderId = event.params.id.toHex()

  let order = Order.load(orderId)
  if (order == null) {
    return
  }

  order.status = status.CANCELLED
  order.blockNumber = event.block.number
  order.updatedAt = event.block.timestamp
  order.save()

  let nftId = getNFTId(
    event.params.nftAddress.toHexString(),
    event.params.assetId.toString()
  )

  let nft = new NFT(nftId)
  nft = updateNFTOrderProperties(nft!, order!)
  nft.save()
}
