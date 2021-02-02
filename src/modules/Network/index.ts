import { dataSource } from '@graphprotocol/graph-ts'

export function getNetwork(): string {
  return dataSource.network() == "mainnet" ? "ethereum" : dataSource.network()
}