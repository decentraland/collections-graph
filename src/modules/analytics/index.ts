import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { Item, NFT, Sale } from '../../entities/schema'
import { createOrLoadAccount, ZERO_ADDRESS } from '../Account'
import { buildCountFromPrimarySale, buildCountFromRoyalties, buildCountFromSale, buildCountFromSecondarySale } from '../Count'
import { ONE_MILLION } from '../Store'

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
  feesCollectorCut: BigInt,
  feesCollector: Address,
  royaltiesCut: BigInt,
  timestamp: BigInt,
  txHash: Bytes,
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

  // update Fees
  sale.feesCollector = feesCollector
  sale.royaltiesCollector = Address.fromString(ZERO_ADDRESS)
  sale.feesCollectorCut = feesCollectorCut.times(sale.price).div(ONE_MILLION)
  sale.royaltiesCut = royaltiesCut.times(sale.price).div(ONE_MILLION)

  let totalFees = sale.feesCollectorCut.plus(sale.royaltiesCut)

  // count sale
  count = buildCountFromRoyalties(totalFees)
  count.save()

  if (royaltiesCut.gt(BigInt.fromI32(0))) {
    if (item.beneficiary != ZERO_ADDRESS || item.creator != ZERO_ADDRESS) {
      sale.royaltiesCollector = Address.fromString(item.beneficiary) || Address.fromString(item.creator)

      // update royalties collector account
      let royaltiesCollectorAccount = createOrLoadAccount(sale.royaltiesCollector as Address)
      royaltiesCollectorAccount.earned = royaltiesCollectorAccount.earned.plus(sale.royaltiesCut)
      royaltiesCollectorAccount.royalties = royaltiesCollectorAccount.royalties.plus(sale.royaltiesCut)
      royaltiesCollectorAccount.save()
    } else {
      // If there is not royalties receiver, all the fees goes to the fees collector
      sale.feesCollectorCut = sale.feesCollectorCut.plus(sale.royaltiesCut)
      sale.royaltiesCut = BigInt.fromI32(0)
    }
  }

  sale.save()

  // update buyer account
  let buyerAccount = createOrLoadAccount(buyer)
  buyerAccount.purchases += 1
  buyerAccount.spent = buyerAccount.spent.plus(price)
  buyerAccount.save()

  // update seller account
  let sellerAccount = createOrLoadAccount(seller)
  sellerAccount.sales += 1
  sellerAccount.earned = sellerAccount.earned.plus(price.minus(totalFees))
  sellerAccount.save()

  // update fees collector account
  let feesCollectorAccount = createOrLoadAccount(feesCollector)
  feesCollectorAccount.earned = feesCollectorAccount.earned.plus(sale.feesCollectorCut)
  feesCollectorAccount.royalties = feesCollectorAccount.royalties.plus(sale.feesCollectorCut)
  feesCollectorAccount.save()

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
