import { BigInt, Address } from '@graphprotocol/graph-ts'
import { Account } from '../../entities/schema'

export let ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function createOrLoadAccount(id: Address): Account {
  let account = Account.load(id.toHex())

  if (account == null) {
    account = new Account(id.toHex())
    account.address = id
    account.totalCurations = 0
    account.sales = 0
    account.primarySales = 0
    account.purchases = 0
    account.earned = BigInt.fromI32(0)
    account.primarySalesEarned = BigInt.fromI32(0)
    account.spent = BigInt.fromI32(0)
    account.royalties = BigInt.fromI32(0)
    account.collections = 0
    account.uniqueAndMythicItems = []
    account.uniqueAndMythicItemsTotal = 0
    account.creatorsSupported = []
    account.creatorsSupportedTotal = 0
    account.uniqueCollectors = []
    account.uniqueCollectorsTotal = 0
  }

  account.save()

  return account
}
