import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as'
import { Collection, Item } from '../../src/entities/schema'
import { SetGlobalMinter } from '../../src/entities/templates/CollectionV2/CollectionV2'

export let addresses = [
  Address.fromString('0x3d0446B2E9dF7666Db1E5e00196D7B938549c184'),
  Address.fromString('0x62B6B151bc1E95e2B949fb02fdB7490a55732AbA'),
  Address.fromString('0xE651406ba6bA60304f9Bc88B771557701620a3E1'),
  Address.fromString('0xd91F00A401038DCdeE4b442E30ae67585546Cd71'),
  Address.fromString('0xD6EEc52deEf0e2ed6a956f59d7af0048318e10D4'),
  Address.fromString('0xe764A5c558393221081cDAd6DDB67508611A2C13'),
  Address.fromString('0xdF70e8216FA45e8CD638ccf28ABD7d7C555F3c8f'),
  Address.fromString('0x73c0CBdfC8050b9718c7fb18550D4b426860c0Fb'),
  Address.fromString('0xEb71F894447ef8D2A2a2D09f6dDd8720E2F7C901'),
  Address.fromString('0x29410998040a2166329D1a955128a0591636d96F')
]

export function createCollection(id: string): Collection {
  let collection = new Collection(id)

  collection.owner = addresses[0].toString()
  collection.creator = addresses[0].toString()
  collection.name = id
  collection.symbol = id
  collection.minters = []
  collection.managers = []
  collection.urn = id
  collection.itemsCount = 0
  collection.createdAt = BigInt.fromI32(0)
  collection.updatedAt = BigInt.fromI32(0)
  collection.reviewedAt = BigInt.fromI32(0)
  collection.searchIsStoreMinter = false
  collection.searchText = id

  return collection
}

export function createItem(id: string): Item {
  let item = new Item(id)

  item.collection = addresses[0].toString()
  item.blockchainId = BigInt.fromI32(0)
  item.creator = addresses[0].toString()
  item.itemType = 'emote_v1'
  item.totalSupply = BigInt.fromI32(0)
  item.maxSupply = BigInt.fromI32(0)
  item.rarity = 'common'
  item.creationFee = BigInt.fromI32(0)
  item.available = BigInt.fromI32(0)
  item.price = BigInt.fromI32(0)
  item.beneficiary = addresses[0].toString()
  item.URI = 'uri'
  item.minters = []
  item.managers = []
  item.rawMetadata = 'rawMetadata'
  item.urn = 'urn'
  item.createdAt = BigInt.fromI32(0)
  item.updatedAt = BigInt.fromI32(0)
  item.reviewedAt = BigInt.fromI32(0)
  item.sales = 0
  item.volume = BigInt.fromI32(0)
  item.searchIsStoreMinter = false
  item.uniqueCollectors = []
  item.uniqueCollectorsTotal = 0

  return item
}

export function createSetGlobalMinterEvent(source: Address, minter: Address, value: boolean): SetGlobalMinter {
  let ev: SetGlobalMinter = changetype<SetGlobalMinter>(newMockEvent())

  ev.address = source

  ev.parameters = new Array()

  let minterParam = new ethereum.EventParam('_minter', ethereum.Value.fromAddress(minter))
  let valueParam = new ethereum.EventParam('_value', ethereum.Value.fromBoolean(value))

  ev.parameters.push(minterParam)
  ev.parameters.push(valueParam)

  return ev
}
