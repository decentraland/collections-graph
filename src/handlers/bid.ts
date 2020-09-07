import { BigInt, Address, log } from '@graphprotocol/graph-ts'
import {
  BidCreated,
  BidAccepted,
  BidCancelled
} from '../entities/ERC721Bid/ERC721Bid'
import { Bid, NFT } from '../entities/schema'
import { getNFTId, cancelActiveBids } from '../modules/NFT'
import * as status from '../modules/Order'

export function handleBidCreated(event: BidCreated): void {
  let nftId = getNFTId(
    event.params._tokenAddress.toHexString(),
    event.params._tokenId.toString()
  )
  let id = event.params._id.toHex()

  let bid = new Bid(id)

  let nft = NFT.load(nftId)
  if (nft == null) {
    log.info('Undefined NFT {} for order {} and address {}', [nftId, id, event.params._tokenAddress.toHexString()])
    return
  }

  bid.status = status.OPEN
  bid.nftAddress = event.params._tokenAddress
  bid.bidder = event.params._bidder
  bid.price = event.params._price
  bid.blockNumber = event.block.number
  bid.expiresAt = event.params._expiresAt.times(BigInt.fromI32(1000))
  bid.createdAt = event.block.timestamp
  bid.updatedAt = event.block.timestamp

  bid.nft = nftId
  bid.seller = Address.fromString(nft.owner)

  bid.save()

  cancelActiveBids(nft!, event.block.timestamp)
}

export function handleBidAccepted(event: BidAccepted): void {
  let id = event.params._id.toHex()

  let bid = Bid.load(id)
  if (bid == null) {
    return
  }

  bid.status = status.SOLD
  bid.seller = event.params._seller
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp

  bid.save()
}

export function handleBidCancelled(event: BidCancelled): void {
  let id = event.params._id.toHex()

  let bid = Bid.load(id)
  if (bid == null) {
    return
  }

  bid.status = status.CANCELLED
  bid.blockNumber = event.block.number
  bid.updatedAt = event.block.timestamp

  bid.save()
}
