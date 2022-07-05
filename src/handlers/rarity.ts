import { AddRarity, UpdatePrice } from '../entities/Rarity/Rarity'
import * as utils from '../modules/rarity'

let CURRENCY = 'MANA'

export function handleAddRarity(event: AddRarity): void {
  utils.handleAddRarity(event.params._rarity.name, event.params._rarity.price, event.params._rarity.maxSupply, CURRENCY)
}

export function handleUpdatePrice(event: UpdatePrice): void {
  utils.handleUpdatePrice(event.params._name, event.params._price, CURRENCY)
}
