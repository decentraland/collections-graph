import { log, BigInt, Address, ByteArray, Bytes, dataSource } from '@graphprotocol/graph-ts'

import { createAccount } from '../modules/Account'
import { Collection, Item, NFT } from '../entities/schema'
import { ProxyCreated, OwnershipTransferred } from '../entities/CollectionFactory/CollectionFactory'
import {
  SetGlobalMinter,
  SetItemMinter,
  SetGlobalManager,
  SetItemManager,
  AddItem,
  RescueItem,
  UpdateItem,
  Issue,
  Approve,
  SetEditable,
  Complete,
  CreatorshipTransferred,
  CollectionV2 as CollectionContract
} from '../entities/templates/CollectionV2/CollectionV2'
import { CollectionV2 } from '../entities/templates'

export function handleCollectionCreation(event: ProxyCreated): void {
  // Initialize template
  CollectionV2.create(event.params._address)

  // Bind contract
  let collectionContract = CollectionContract.bind(event.params._address)

  let collectionAddress = event.params._address.toHexString()
  let collection = new Collection(collectionAddress)

  // Set base collection data
  collection.name = collectionContract.name()
  collection.symbol = collectionContract.symbol()
  collection.owner = collectionContract.owner().toHexString()
  collection.creator = collectionContract.creator().toHexString()
  collection.isCompleted = collectionContract.isCompleted()
  collection.isApproved = collectionContract.isApproved()
  collection.isEditable = collectionContract.isEditable()
  collection.minters = []
  collection.managers = []

  // Set Items
  let itemsCount = collectionContract.itemsCount()
  for (let i = BigInt.fromI32(0); i.lt(itemsCount); i = i.plus(BigInt.fromI32(1))) {
    let contractItem = collectionContract.items(i)

    let item = new Item(collectionAddress + '_' + i.toHexString())
    item.itemId = i
    item.collection = collection.id
    item.rariy = collectionContract.getRarityName(contractItem.value0)
    item.available = collectionContract.getRarityValue(contractItem.value0)
    item.totaSupply = contractItem.value1
    item.price = contractItem.value2
    item.beneficiary = contractItem.value3.toHexString()
    item.metadata = contractItem.value4
    item.contentHash = contractItem.value5
    item.URI = collectionContract.baseURI() + collectionAddress + '/' + i.toHexString()
    item.minters = []
    item.managers = []

    item.save()
  }

  collection.save()
}

export function handleSetGlobalMinter(event: SetGlobalMinter): void {
  let collection = Collection.load(event.address.toHexString())

  let minters = collection.minters
  if (event.params._value == true) {
    minters.push(event.params._minter.toHexString())
  } else {
    minters = minters.filter(minter => minter != event.params._minter.toHexString())
  }

  collection.minters = minters

  collection.save()
}

export function handleSetGlobalManager(event: SetGlobalManager): void {
  let collection = Collection.load(event.address.toHexString())

  let managers = collection.managers
  if (event.params._value == true) {
    managers.push(event.params._manager.toHexString())
  } else {
    managers = managers.filter(manager => manager != event.params._manager.toHexString())
  }

  collection.managers = managers

  collection.save()
}

export function handleSetItemMinter(event: SetItemMinter): void {
  let item = Item.load(event.params._itemId.toHexString())

  let minters = item.minters
  if (event.params._value == true) {
    minters.push(event.params._minter.toHexString())
  } else {
    minters = minters.filter(minter => minter != event.params._minter.toHexString())
  }

  item.minters = minters

  item.save()
}

export function handleSetItemManager(event: SetItemManager): void {
  let item = Item.load(event.params._itemId.toHexString())

  let managers = item.managers
  if (event.params._value == true) {
    managers.push(event.params._manager.toHexString())
  } else {
    managers = managers.filter(manager => manager != event.params._manager.toHexString())
  }

  item.managers = managers

  item.save()
}

export function handleAddItem(event: AddItem): void {
  let collectionAddress = event.address.toHexString()

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)

  let contractItem = event.params._item
  let itemId = event.params._itemId

  let item = new Item(collectionAddress + '_' + itemId.toHexString())
  item.itemId = itemId
  item.collection = collectionAddress
  item.rariy = collectionContract.getRarityName(contractItem.rarity)
  item.available = collectionContract.getRarityValue(contractItem.rarity)
  item.totaSupply = contractItem.totalSupply
  item.price = contractItem.price
  item.beneficiary = contractItem.beneficiary.toHexString()
  item.metadata = contractItem.metadata
  item.contentHash = contractItem.contentHash
  item.URI = collectionContract.baseURI() + collectionAddress + '/' + itemId.toString()
  item.minters = []
  item.managers = []

  item.save()
}

export function handleRescueItem(event: RescueItem): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let item = Item.load(collectionAddress + '_' + itemId)

  item.metadata = event.params._metadata
  item.contentHash = event.params._contentHash

  item.save()
}

export function handleUpdateItem(event: UpdateItem): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let item = Item.load(collectionAddress + '_' + itemId)

  item.price = event.params._price
  item.beneficiary = event.params._beneficiary.toHexString()

  item.save()
}

export function handleIssueItem(event: Issue): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let item = Item.load(collectionAddress + '_' + itemId)
  item.available = item.available.minus(BigInt.fromI32(1))
  item.save()

  let nft = new NFT(collectionAddress + '_' + event.params._tokenId.toHexString())

  nft.tokenId = event.params._tokenId
  nft.contractAddress = collectionAddress
  nft.itemId = event.params._itemId
  nft.issuedId = event.params._issuedId
  nft.collection = collectionAddress
  nft.item = item.id
  nft.owner = event.params._beneficiary.toHexString()
  nft.tokenURI = item.URI + '/' + event.params._issuedId.toString()
  nft.name = 'Token item'
  nft.image = item.URI + '/' + event.params._issuedId.toString() + '/thumbnail'
  nft.searchText = item.metadata
  nft.createdAt = event.block.timestamp
  nft.updatedAt = event.block.timestamp

  createAccount(event.params._beneficiary)

  nft.save()

}

export function handleApproveCollection(event: Approve): void {
  let collection = Collection.load(event.address.toHexString())

  collection.isApproved = true

  collection.save()
}

export function handleSetEditable(event: SetEditable): void {
  let collection = Collection.load(event.address.toHexString())

  collection.isEditable = event.params._newValue

  collection.save()
}

export function handleCompleteCollection(event: Complete): void {
  let collection = Collection.load(event.address.toHexString())

  collection.isCompleted = true

  collection.save()
}

export function handleTransferCreatorship(event: CreatorshipTransferred): void {
  let collection = Collection.load(event.address.toHexString())

  collection.creator = event.params._newCreator.toHexString()

  collection.save()
}

export function handleTransferOwnership(event: OwnershipTransferred): void {
  let collection = Collection.load(event.address.toHexString())

  collection.owner = event.params.newOwner.toHexString()

  collection.save()
}