import { BigInt, log, Address, Bytes } from '@graphprotocol/graph-ts'

import * as status from '../order'
import { ZERO_ADDRESS } from '../account'
import { NFT, Order } from '../../entities/schema'
import { ERC721 } from '../../entities/templates/ERC721/ERC721'

export function isMint(to: string): boolean {
  return to == ZERO_ADDRESS
}

export function getNFTId(contractAddress: string, id: string): string {
  return contractAddress + '-' + id
}

export function updateNFTOrderProperties(nft: NFT, order: Order): NFT {
  if (order.status == status.OPEN) {
    return addNFTOrderProperties(nft, order)
  } else if (order.status == status.SOLD || order.status == status.CANCELLED) {
    return clearNFTOrderProperties(nft)
  } else {
    return nft
  }
}

export function addNFTOrderProperties(nft: NFT, order: Order): NFT {
  nft.activeOrder = order.id
  nft.searchOrderStatus = order.status
  nft.searchOrderPrice = order.price
  nft.searchOrderCreatedAt = order.createdAt
  nft.searchOrderExpiresAt = order.expiresAt
  return nft
}

export function clearNFTOrderProperties(nft: NFT): NFT {
  nft.activeOrder = ''
  nft.searchOrderStatus = null
  nft.searchOrderPrice = null
  nft.searchOrderCreatedAt = null
  nft.searchOrderExpiresAt = null
  return nft
}

export function cancelActiveOrder(nft: NFT, now: BigInt): boolean {
  if (nft.activeOrder == '' || nft.activeOrder == null) {
    return false
  }
  let oldOrder = Order.load(nft.activeOrder!)
  if (oldOrder != null && (oldOrder.status == status.OPEN || oldOrder.status == status.TRANSFERRED)) {
    // Here we are setting old orders as cancelled, because the smart contract allows new orders to be created
    // and they just overwrite them in place. But the subgraph stores all orders ever
    // you can also overwrite ones that are expired
    oldOrder.status = status.CANCELLED
    oldOrder.updatedAt = now
    oldOrder.save()

    return true
  }
  return false
}

export function getTokenURI(collectionAddress: Address, tokenId: BigInt): string {
  let erc721 = ERC721.bind(collectionAddress)
  let tokenURICallResult = erc721.try_tokenURI(tokenId)

  let tokenURI = ''

  if (tokenURICallResult.reverted) {
    log.warning('tokenURI reverted for tokenID: {} contract: {}', [tokenId.toString(), collectionAddress.toHexString()])
  } else {
    tokenURI = tokenURICallResult.value
  }

  return tokenURI
}

export function handleTransferOrder(nft: NFT | null, to: Bytes): void {
  if (nft != null && nft.activeOrder != null) {
    let oldOrder = Order.load(nft.activeOrder!)
    if (oldOrder != null && oldOrder.status == status.OPEN) {
      oldOrder.status = status.TRANSFERRED
      oldOrder.save()
      nft.searchOrderStatus = status.TRANSFERRED
    } else if (oldOrder != null && oldOrder.status == status.TRANSFERRED) {
      let isComingBackToOrderOwner = oldOrder.owner == to
      if (isComingBackToOrderOwner) {
        oldOrder.status = status.OPEN
        oldOrder.save()
        nft.searchOrderStatus = status.OPEN
      } else {
        nft.searchOrderStatus = status.TRANSFERRED
      }
    }
  }
}
