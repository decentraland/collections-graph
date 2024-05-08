import { Address, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { Rarity } from '../../entities/schema'

let ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
let RARITY_MUMBAI = '0x8eabf06f6cf667915bff30138be70543bce2901a'
let RARITY_MATIC = '0x17113b44fdd661a156cc01b5031e3acf72c32eb3'
let RARITY_AMOY = '0xddb3781fff645325c8896aa1f067baa381607ecc'
let RARITIES_WITH_ORACLE_MUMBAI = '0xb9957735bbe6d42585058af11aa72da8ead9043a'
let RARITIES_WITH_ORACLE_MATIC = '0xa9158e22f89bb3f69c5600338895cb5fb81e5090'
let RARITIES_WITH_ORACLE_AMOY = '0x25b6b4bac4adb582a0abd475439da6730777fbf7'

export function getRarityAddress(): Address {
  let network = dataSource.network()
  let addressString = network == 'polygon-amoy' ? RARITY_AMOY : network == 'mumbai' ? RARITY_MUMBAI : network == 'matic' ? RARITY_MATIC : ZERO_ADDRESS

  return Address.fromString(addressString)
}

export function getRaritiesWithOracleAddress(): Address {
  let network = dataSource.network()
  let addressString = network == 'polygon-amoy' ? RARITIES_WITH_ORACLE_AMOY : network == 'mumbai' ? RARITIES_WITH_ORACLE_MUMBAI : network == 'matic' ? RARITIES_WITH_ORACLE_MATIC : ZERO_ADDRESS

  return Address.fromString(addressString)
}

export function handleAddRarity(name: string, price: BigInt, maxSupply: BigInt, currency: string): void {
  let rarity = Rarity.load(name)

  if (rarity === null) {
    rarity = new Rarity(name)
  } else if (rarity.currency != currency) {
    log.info('Ignoring because it was not added with the current Rarity Contract', [])
    return
  }

  rarity.name = name
  rarity.price = price
  rarity.maxSupply = maxSupply
  rarity.currency = currency
  rarity.save()
}

export function handleUpdatePrice(name: string, price: BigInt, currency: string): void {
  let rarity = Rarity.load(name)

  if (rarity === null) {
    log.error('Rarity with name {} not found', [name])
    return
  }

  if (rarity.currency != currency) {
    log.info('Ignoring because it was not added with the current Rarity Contract', [])
    return
  }

  rarity.price = price
  rarity.currency = currency
  rarity.save()
}
