import { Item } from "../../entities/schema"
import { getCatalystBase } from '../Catalyst'


export function getItemId(contractAddress: string, itemId: string): string {
  return contractAddress + '-' + itemId
}

export function getItemImage(item: Item): string {
  let baseURI = getCatalystBase()

  return baseURI + '/lambdas/collections/contents/' + item.urn + '/thumbnail'
}

export function removeItemMinter(item: Item, minter: string): Array<string> {
  let newMinters = new Array<string>(0)
  let minters = item.minters

  for (let i = 0; i < minters.length; i++) {
    if (minters[i] != minter) {
      newMinters.push(minters[i])
    }
  }

  return newMinters
}