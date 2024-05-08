import { dataSource, log, BigInt } from '@graphprotocol/graph-ts'

export let ONE_MILLION = BigInt.fromI32(1000000)

export function getStoreAddress(): string {
  let network = dataSource.network()

  if (network == 'matic') {
    return '0x214ffc0f0103735728dc66b61a22e4f163e275ae'
  }

  if (network == 'mumbai') {
    return '0x6ddf1b1924dad850adbc1c02026535464be06b0c'
  }

  if (network == 'polygon-amoy') {
    return '0xe36abc9ec616c83caaa386541380829106149d68'
  }

  log.debug('Could not find store address. Invalid network {}', [network])
  return ''
}
