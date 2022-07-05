import { log, BigInt } from '@graphprotocol/graph-ts'
import { OrderCreated, OrderSuccessful, OrderCancelled, Marketplace } from '../entities/Marketplace/Marketplace'
import { Order, NFT } from '../entities/schema'
import { getNFTId, updateNFTOrderProperties, cancelActiveOrder } from '../modules/NFT'
import { buildCountFromOrder } from '../modules/Count'
import * as status from '../modules/Order'
import { ORDER_SALE_TYPE, trackSale } from '../modules/analytics'

export function handleOrderCreated(event: OrderCreated): void {
  let nftId = getNFTId(event.params.nftAddress.toHexString(), event.params.assetId.toString())

  let orderId = event.params.id.toHex()

  let nft = NFT.load(nftId)
  if (nft == null) {
    log.info('Undefined NFT {} for order {} and address {}', [nftId, orderId, event.params.nftAddress.toHexString()])
    return
  }

  let order = new Order(orderId)
  order.marketplaceAddress = event.address
  order.status = status.OPEN
  order.nft = nftId
  order.nftAddress = event.params.nftAddress
  order.tokenId = event.params.assetId
  order.txHash = event.transaction.hash
  order.owner = event.params.seller
  order.price = event.params.priceInWei
  order.expiresAt = event.params.expiresAt
  order.blockNumber = event.block.number
  order.createdAt = event.block.timestamp
  order.updatedAt = event.block.timestamp

  order.save()

  if (nft.activeOrder != null) {
    cancelActiveOrder(nft, event.block.timestamp)
  }

  nft.updatedAt = event.block.timestamp
  nft = updateNFTOrderProperties(nft, order)
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

  if (!order.nft) {
    return
  }

  let nft = NFT.load(order.nft!)
  if (!nft) {
    log.info('Undefined NFT {} for order {} and address {}', [order.nft!, orderId, event.params.nftAddress.toHexString()])
    return
  }

  nft.owner = event.params.buyer.toHex()
  nft.updatedAt = event.block.timestamp
  nft = updateNFTOrderProperties(nft, order)
  nft.save()

  // Bind contract
  let marketplaceContract = Marketplace.bind(event.address)
  // On ropsten we hace a different version of the marketplace where the method is ownerCutPercentage
  let ownerCutPerMillion = marketplaceContract.try_ownerCutPerMillion()

  // analytics
  trackSale(
    ORDER_SALE_TYPE,
    event.params.buyer,
    event.params.seller,
    event.params.seller,
    nft.item!,
    nft.id,
    order.price,
    ownerCutPerMillion.reverted ? BigInt.fromI32(0) : ownerCutPerMillion.value,
    marketplaceContract.owner(),
    BigInt.fromI32(0),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleOrderCancelled(event: OrderCancelled): void {
  let orderId = event.params.id.toHex()

  let order = Order.load(orderId)
  if (order == null) {
    return
  }

  if (order.nft != null) {
    let nft = NFT.load(order.nft!)
    if (!nft) {
      log.info('Undefined NFT {} for order {} and address {}', [order.nft!, orderId, event.params.nftAddress.toHexString()])
      return
    }

    order.status = status.CANCELLED
    order.blockNumber = event.block.number
    order.updatedAt = event.block.timestamp
    order.save()

    nft.updatedAt = event.block.timestamp
    nft = updateNFTOrderProperties(nft, order)
    nft.save()
  }
}
