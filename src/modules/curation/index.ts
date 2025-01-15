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

// List of allowed committee function selectors
// 0x07bd3522: forwardMetaTx(address _target, bytes calldata _data)
// 0xad718d2a: sponsoredCallV2(address _target,bytes _data,bytes32 _correlationId,bytes32 _r,bytes32 _vs)
// 0x81c9308e: manageCollection(address,address,address,bytes[]) selector
export const ALLOWED_SELECTORS: string[] = ['0x07bd3522', '0xad718d2a', '0x81c9308e']

/**
 * Verify if it's an allowed committee transaction input.
 * @param txInput - The transaction input data as a hexadecimal string.
 * @returns True if the input starts with an allowed selector, false otherwise.
 */
export function isAllowedCommitteeTxInput(txInput: string): boolean {
  for (let i = 0; i < ALLOWED_SELECTORS.length; i++) {
    if (txInput.startsWith(ALLOWED_SELECTORS[i])) {
      return true
    }
  }
  return false
}
