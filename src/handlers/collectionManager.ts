import { BigInt, log } from '@graphprotocol/graph-ts'
import { RaritiesSet } from '../entities/CollectionManager/CollectionManager'
import { RaritiesWithOracle } from '../entities/RaritiesWithOracle/RaritiesWithOracle'
import { Rarity as RarityContract } from '../entities/Rarity/Rarity'
import { Rarity } from '../entities/schema'
import { getRarityAddress, getRaritiesWithOracleAddress } from '../modules/rarity'

export function handleRaritiesSet(event: RaritiesSet): void {
  let raritiesWithOracleAddress = getRaritiesWithOracleAddress()
  let rarityAddress = getRarityAddress()
  let newRaritiesAddress = event.params._newRarities

  if (newRaritiesAddress == raritiesWithOracleAddress) {
    let raritiesWithOracle = RaritiesWithOracle.bind(raritiesWithOracleAddress)
    let raritiesCount = raritiesWithOracle.raritiesCount().toI32()

    for (let i = 0; i < raritiesCount; i++) {
      let blockchainRarity = raritiesWithOracle.rarities(BigInt.fromI32(i))
      let name = blockchainRarity.getName()
      let rarity = Rarity.load(name)

      if (rarity === null) {
        rarity = new Rarity(name)
      }

      rarity.name = blockchainRarity.getName()
      rarity.price = blockchainRarity.getPrice()
      rarity.maxSupply = blockchainRarity.getMaxSupply()
      rarity.currency = 'USD'
      rarity.save()
    }
  } else if (newRaritiesAddress == rarityAddress) {
    let rarityContract = RarityContract.bind(rarityAddress)
    let raritiesCount = rarityContract.raritiesCount().toI32()

    for (let i = 0; i < raritiesCount; i++) {
      let blockchainRarity = rarityContract.rarities(BigInt.fromI32(i))
      let name = blockchainRarity.getName()
      let rarity = Rarity.load(name)

      if (rarity === null) {
        rarity = new Rarity(name)
      }

      rarity.name = blockchainRarity.getName()
      rarity.price = blockchainRarity.getPrice()
      rarity.maxSupply = blockchainRarity.getMaxSupply()
      rarity.currency = 'MANA'
      rarity.save()
    }
  } else {
    log.error('Unsupported rarity contract address {}', [newRaritiesAddress.toHexString()])
  }
}
