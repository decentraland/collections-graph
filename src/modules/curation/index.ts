import { BigInt } from '@graphprotocol/graph-ts'
import { getNetwork } from '../network'

export function getCurationId(collectionAddress: string, transactionHash: string, logIndex: string): string {
  return collectionAddress + '-' + transactionHash + '-' + logIndex
}

export function getBlockWhereRescueItemsStarted(): BigInt {
  let network = getNetwork()

  if (network == 'matic') {
    return BigInt.fromI32(20841775)
  }

  if (network == 'mumbai') {
    return BigInt.fromI32(19885000)
  }

  if (network == 'amoy') {
    return BigInt.fromI32(5706678)
  }

  return BigInt.fromI32(I32.MAX_VALUE)
}
