import { Address, dataSource } from '@graphprotocol/graph-ts'

// Values returned by this function are taken from the different network files found in
// the config directory. Keep in mind to change this values if they change there.
// Initially, I wanted to import those config json to avoid duplication but it was not possible.
export function getRaritiesWithOracleAddress(): Address | null {
  let network = dataSource.network()

  if (network == 'mumbai') {
    return Address.fromString('0xb9957735bbe6d42585058af11aa72da8ead9043a')
  }

  if (network == 'matic') {
    return Address.fromString('0xa9158e22f89bb3f69c5600338895cb5fb81e5090')
  }

  return null
}
