import { log } from '@graphprotocol/graph-ts'
import { AddRarity, UpdatePrice } from '../entities/Rarity/Rarity'
import { Rarity } from '../entities/schema'

export function handleAddRarity(event: AddRarity): void {
  let name = event.params._rarity.name

  let rarity = new Rarity(name)

  rarity.name = name
  rarity.price = event.params._rarity.price
  rarity.maxSupply = event.params._rarity.maxSupply
  rarity.currency = 'MANA'

  rarity.save()
}

export function handleUpdatePrice(event: UpdatePrice): void {
  let rarity = Rarity.load(event.params._name)

  // If currency is USD, it's because it has already been handled by the new RaritiesWithOracle.
  // If so, We don't care about changes made on the on the unused Rarity contract.
  if (rarity.currency == 'USD') {
    log.warning("Updates made in the old contract will not be reflected in the graph", [])
    return
  }

  rarity.price = event.params._price

  rarity.save()
}
