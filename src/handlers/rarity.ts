import { AddRarity, UpdatePrice } from '../entities/Rarity/Rarity'
import { Rarity } from '../entities/schema'

export function handleAddRarity(event: AddRarity): void {
  let rarity = new Rarity(event.params._rarity.name)

  rarity.name = event.params._rarity.name
  rarity.price = event.params._rarity.price
  rarity.maxSupply = event.params._rarity.maxSupply

  rarity.save()
}

export function handleUpdatePrice(event: UpdatePrice): void {
  let rarity = Rarity.load(event.params._name)

  if (rarity != null) {
    rarity.price = event.params._price
    rarity.save()
  }
}
