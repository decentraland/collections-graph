import { Item } from "../../entities/schema"

export function getItemId(contractAddress: string, itemId: string): string {
  return contractAddress + '-' + itemId
}

export function getItemImage(item: Item): string {
  let URI = item.URI.split('standard/')  // https://peer.decentraland.[org|zone]/collections/standard/...
  let baseURI = URI[0]  // https://peer.decentraland.[org|zone]/

  return baseURI + 'contents/' + item.urn + '/image'
}

export function removeItemMinter(item: Item, minter: string): Array<string> {
  let newMinters = new Array<string>(0)
  let minters = item.minters

  for (let i = 0; i < minters.length; i++) {
    if (minters![i] != minter) {
      newMinters.push(minters![i])
    }
  }

  return newMinters
}