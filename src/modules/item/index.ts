export function getItemId(contractAddress: string, itemId: string): string {
  return contractAddress + '-' + itemId
}