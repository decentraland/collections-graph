import { log } from '@graphprotocol/graph-ts'
import { AddRarity, UpdatePrice } from '../entities/Rarity/Rarity'
import { Rarity } from '../entities/schema'

export function handleAddRarity(event: AddRarity): void {
  let name = event.params._rarity.name

  let rarity = Rarity.load(name)

  if (rarity == null) {
    rarity = new Rarity(name)
  } else if (rarity.currency === 'USD') {
    log.warning('Rarity with name {} already updated by new contract', [name])
    return
  }

  rarity.name = name
  rarity.price = event.params._rarity.price
  rarity.maxSupply = event.params._rarity.maxSupply
  rarity.currency = 'MANA'

  rarity.save()
}

export function handleUpdatePrice(event: UpdatePrice): void {
  let name = event.params._name
  
  let rarity = Rarity.load(name)

  if (rarity == null) {
    log.error('Rarity with name {} not found',[name])
    return
  }

  // If currency is USD, it's because it has already been handled by the new RaritiesWithOracle.
  // If so, We don't care about changes made on the on the unused Rarity contract.
  if (rarity.currency == 'USD') {
    log.warning('Rarity with name {} already updated by new contract', [name])
    return
  }

  rarity.price = event.params._price

  rarity.save()
}
