import { BigInt, Address, log } from '@graphprotocol/graph-ts'
import { BidCreated, BidAccepted, BidCancelled, ERC721Bid } from '../entities/ERC721Bid/ERC721Bid'
import { Bid, NFT, Item } from '../entities/schema'
import { getNFTId } from '../modules/NFT'
import * as status from '../modules/Order'
import { getBidId } from '../modules/bid'
import { buildCountFromBid } from '../modules/Count'
import { BID_SALE_TYPE, trackSale } from '../modules/analytics'

export function handleBidCreated(event: BidCreated): void {
  let nftId = getNFTId(event.params._tokenAddress.toHexString(), event.params._tokenId.toString())

  let id = getBidId(event.params._tokenAddress.toHexString(), event.params._tokenId.toString(), event.params._bidder.toHexString())

  let bid = new Bid(id)

  let nft = NFT.load(nftId)
  if (nft == null) {
    log.info('Undefined NFT {} for bid {} and address {}', [nftId, id, event.params._tokenAddress.toHexString()])
    return
  }

  bid.status = status.OPEN
  bid.bidAddress = event.address
  bid.nftAddress = event.params._tokenAddress
  bid.tokenId = event.params._tokenId
  bid.bidder = event.params._bidder
  bid.price = event.params._price
  bid.blockchainId = event.params._id.toHexString()
  bid.blockNumber = event.block.number
  bid.expiresAt = event.params._expiresAt.times(BigInt.fromI32(1000))
  bid.createdAt = event.block.timestamp
  bid.updatedAt = event.block.timestamp

  bid.nft = nftId
  bid.seller = Address.fromString(nft.owner)
  bid.save()

  nft.updatedAt = event.block.timestamp
  nft.save()

  // count bid
  let count = buildCountFromBid()
  count.save()
}

export function handleBidAccepted(event: BidAccepted): void {
  let id = event.params._id.toHex()

  let bid = Bid.load(id)

  // Omit events of a bid accepted/cancelled from a bid that was not indexed. Orders and bids are being indexed from the beginning of collections.
  // Not from the Bid contract creation.
  if (bid == null) {
    return
  }

  let nft = NFT.load(bid.nft)
  if (nft == null) {
    log.info('Undefined NFT {} for bid {} and address {}', [bid.nft, id, event.params._tokenAddress.toHexString()])
    return
  }

  bid.status = status.SOLD
  bid.seller = event.params._seller
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()

  nft.updatedAt = event.block.timestamp
  nft.save()

  // Bind contract
  let bidContract = ERC721Bid.bind(event.address)

  // count secondary sale
  trackSale(
    BID_SALE_TYPE,
    event.params._bidder,
    event.params._seller,
    nft.item,
    nft.id,
    bid.price,
    bidContract.ownerCutPerMillion(),
    bidContract.owner(),
    BigInt.fromI32(0),
    event.block.timestamp,
    event.transaction.hash
  )
}

export function handleBidCancelled(event: BidCancelled): void {
  let id = event.params._id.toHex()

  let bid = Bid.load(id)

  // Omit events of a bid accepted/cancelled from a bid that was not indexed. Orders and bids are being indexed from the beginning of collections.
  // Not from the Bid contract creation.
  if (bid == null) {
    return
  }

  let nft = NFT.load(bid.nft)
  if (nft == null) {
    log.info('Undefined NFT {} for bid {} and address {}', [bid.nft, id, event.params._tokenAddress.toHexString()])
    return
  }

  bid.status = status.CANCELLED
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp
  bid.save()

  nft.updatedAt = event.block.timestamp
  nft.save()
}
