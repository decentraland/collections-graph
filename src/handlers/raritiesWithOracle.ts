import { log } from '@graphprotocol/graph-ts'
import { AddRarity, UpdatePrice } from '../entities/RaritiesWithOracle/RaritiesWithOracle'
import { Rarity } from '../entities/schema'

export function handleAddRarity(event: AddRarity): void {
  let name = event.params._rarity.name

  let rarity = Rarity.load(name)

  if (rarity == null) {
    rarity = new Rarity(name)
  }

  rarity.name = name
  rarity.price = event.params._rarity.price
  rarity.maxSupply = event.params._rarity.maxSupply
  rarity.currency = 'USD'

  rarity.save()
}

export function handleUpdatePrice(event: UpdatePrice): void {
  let name = event.params._name
  
  let rarity = Rarity.load(name)

  if (rarity == null) {
    log.error('Rarity with name {} not found',[name])
    return
  }

  rarity.price = event.params._price

  rarity.save()
}
