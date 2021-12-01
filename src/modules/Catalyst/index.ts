import { dataSource } from '@graphprotocol/graph-ts'
import { log } from '@graphprotocol/graph-ts'

export function getCatalystBase(): string {
  let network = dataSource.network()
  if (network == 'mainnet' || network == 'matic') {
    return 'https://peer-lb.decentraland.org'
  }

  if (network == 'ropsten' || network == 'goerli' || network == 'mumbai') {
    return 'https://peer.decentraland.zone'
  }

  log.debug('Could not find catalyst base. Invalid network {}', [network])
  return ''
}
