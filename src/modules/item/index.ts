import { Item } from "../../entities/schema"

export function getItemId(contractAddress: string, itemId: string): string {
  return contractAddress + '-' + itemId
}

export function getItemImage(item: Item): string {
  let URI = item.URI.split('standard')  // https://peer.decentraland.[org|zone]/collections/standard/...
  let baseURI = URI[0]  // https://peer.decentraland.[org|zone]/collections/

  return baseURI + 'contents/' + item.collection.toString() + '/' + item.blockchainId.toString() + '/thumbnail'
}