import { BigInt } from '@graphprotocol/graph-ts'
import { getNetwork } from '../network'

export function getCurationId(collectionAddress: string, transactionHash: string, logIndex: string): string {
  return collectionAddress + '-' + transactionHash + '-' + logIndex
}

export function getBlockWhereRescueItemsStarted(): BigInt {
  let network = getNetwork()

  if (network == 'matic') {
    return BigInt.fromI32(I32.MAX_VALUE) // WEeneed to set the real blocknumber after we launch this on Polygon mainnet
  }

  if (network == 'mumbai') {
    return BigInt.fromI32(19885000)
  }

  return BigInt.fromI32(I32.MAX_VALUE)
}
