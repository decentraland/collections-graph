import { Address, dataSource } from '@graphprotocol/graph-ts'

// Values returned by this function are taken from the different network files found in
// the config directory. Keep in mind to change this values if they change there.
// Initially, I wanted to import those config json to avoid duplication but it was not possible.
export function getRaritiesWithOracleAddress(): Address | null {
  let network = dataSource.network()

  if (network == 'mumbai') {
    return Address.fromString('0xb9957735bbe6D42585058Af11AA72da8eAD9043a')
  }

  if (network == 'matic') {
    return Address.fromString('0xA9158E22F89Bb3F69c5600338895Cb5FB81e5090')
  }

  return null
}
