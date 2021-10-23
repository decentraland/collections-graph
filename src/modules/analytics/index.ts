import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { Item, NFT, Sale } from '../../entities/schema'
import { createOrLoadAccount } from '../Account'
import { buildCountFromPrimarySale, buildCountFromSale, buildCountFromSecondarySale } from '../Count'

function trackSale(
  type: string,
  buyer: Address,
  seller: Address,
  itemId: string | null,
  nftId: string | null,
  price: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // count sale
  let count = buildCountFromSale(price)
  count.save()

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
  sale.searchItemId = null
  sale.searchTokenId = null
  sale.searchContractAddress = null

  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  buyerAccount.save()

  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price)
  sellerAccount.save()

  if (itemId) {
    let item = Item.load(itemId)
    if (item != null) {
      item.soldAt = timestamp
      item.sales += 1
      item.volume = item.volume.plus(price)
      item.updatedAt = timestamp
      item.save()

      sale.searchItemId = item.blockchainId
      sale.searchContractAddress = item.collection
    } else {
      log.warning('Undefined Item {} type {} hash {}', [itemId, type, txHash.toHexString()])
    }
  }

  if (nftId) {
    let nft = NFT.load(nftId)
    if (nft != null) {
      nft.soldAt = timestamp
      nft.sales += 1
      nft.volume = nft.volume.plus(price)
      nft.updatedAt = timestamp
      nft.save()

      sale.searchTokenId = nft.tokenId
      sale.searchContractAddress = nft.contractAddress
    } else {
      log.warning('Undefined NFT {} type {} hash {}', [nftId, type, txHash.toHexString()])
    }
  }

  sale.save()
}

export function trackSecondarySale(
  type: string,
  buyer: Address,
  seller: Address,
  itemId: string | null,
  nftId: string | null,
  price: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // track sale
  trackSale(type, buyer, seller, itemId, nftId, price, timestamp, txHash)

  // count secondary sale
  let count = buildCountFromSecondarySale(price)
  count.save()
}

export function trackPrimarySale(
  type: string,
  buyer: Address,
  seller: Address,
  itemId: string | null,
  nftId: string | null,
  price: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  // track sale
  trackSale(type, buyer, seller, itemId, nftId, price, timestamp, txHash)

  // count secondary sale
  let count = buildCountFromPrimarySale(price)
  count.save()
}
