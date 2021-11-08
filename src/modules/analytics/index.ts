import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { Item, NFT, Sale } from '../../entities/schema'
import { createOrLoadAccount } from '../Account'
import { buildCountFromPrimarySale, buildCountFromSale, buildCountFromSecondarySale } from '../Count'

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
  sale.save()

  // update buyer account
  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  buyerAccount.save()

  // update seller account
  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price)
  sellerAccount.save()

  // update item
  item.soldAt = timestamp
  item.sales += 1
  item.volume = item.volume.plus(price)
  item.updatedAt = timestamp
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
}
