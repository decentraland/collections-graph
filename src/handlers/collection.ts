import { BigInt, Address } from '@graphprotocol/graph-ts'

import { handleCreateNFT, handleTransferNFT } from './nft'
import { setItemSearchFields, buildItemMetadata } from '../modules/Metadata'
import { buildCount, buildCountFromItem, buildCountFromCollection } from '../modules/Count'
import { getItemId } from '../modules/Item'
import {
  getCollectionsV1
} from '../data/wearablesV1/addresses'
import { isMint } from '../modules/NFT'
import { Collection, Item } from '../entities/schema'
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
  CollectionV2 as CollectionContract,
  Transfer
} from '../entities/templates/CollectionV2/CollectionV2'
import { ERC721 } from '../entities/templates'
import { CollectionV2 } from '../entities/templates'


export function handleInitializeWearablesV1(_: OwnershipTransferred): void {
  let count = buildCount()

  let started = count.started

  count.started = 1
  count.save()

  let collectionsV1 = getCollectionsV1()

  if (started == 0) {
    collectionsV1.forEach(collectionAddress => {
      // Create template bindings
      ERC721.create(Address.fromString(collectionAddress))
    })
  }
}

export function handleCollectionCreation(event: ProxyCreated): void {
  // Initialize template
  CollectionV2.create(event.params._address)

  // Bind contract
  let collectionContract = CollectionContract.bind(event.params._address)

  let collectionAddress = event.params._address.toHexString()
  let collection = new Collection(collectionAddress)

  let isApproved = collectionContract.isApproved()
  // Set base collection data
  collection.name = collectionContract.name()
  collection.symbol = collectionContract.symbol()
  collection.owner = collectionContract.owner().toHexString()
  collection.creator = collectionContract.creator().toHexString()
  collection.isCompleted = collectionContract.isCompleted()
  collection.isApproved = isApproved
  collection.isEditable = collectionContract.isEditable()
  collection.minters = []
  collection.managers = []

  collection.save()

  let metric = buildCountFromCollection()
  metric.save()
}


export function handleAddItem(event: AddItem): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  if (collection == null) {
    // Skip it, collection will be set up once the proxy event is created
    // The ProxyCreated event is emitted right after the collection's event
    return
  }

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)

  let contractItem = event.params._item
  let itemId = event.params._itemId

  let graphItemId = getItemId(collectionAddress, itemId.toHexString())

  let item = new Item(graphItemId)
  item.itemId = itemId
  item.collection = collectionAddress
  item.rarity = collectionContract.getRarityName(contractItem.rarity)
  item.available = collectionContract.getRarityValue(contractItem.rarity)
  item.totaSupply = contractItem.totalSupply
  item.price = contractItem.price
  item.beneficiary = contractItem.beneficiary.toHexString()
  item.contentHash = contractItem.contentHash
  item.rawMetadata = contractItem.metadata
  item.searchIsCollectionApproved = collectionContract.isApproved()
  item.minters = []
  item.managers = []
  item.URI = collectionContract.baseURI() + collectionAddress + '/' + itemId.toString()

  let metadata = buildItemMetadata(item)

  item.metadata = metadata.id
  item.itemType = metadata.itemType

  item = setItemSearchFields(item)
  item.save()

  let metric = buildCountFromItem()
  metric.save()
}

export function handleRescueItem(event: RescueItem): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let graphItemId = getItemId(collectionAddress, itemId)

  let item = Item.load(graphItemId)

  item.rawMetadata = event.params._metadata
  item.contentHash = event.params._contentHash

  let metadata = buildItemMetadata(item!)

  item.metadata = metadata.id
  item.itemType = metadata.itemType

  item = setItemSearchFields(item!)

  item.save()
}

export function handleUpdateItem(event: UpdateItem): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let item = Item.load(collectionAddress + '-' + itemId)

  item.price = event.params._price
  item.beneficiary = event.params._beneficiary.toHexString()

  item.save()
}

export function handleIssue(event: Issue): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toHexString()

  let item = Item.load(collectionAddress + '-' + itemId)
  item.available = item.available.minus(BigInt.fromI32(1))
  item.save()

  handleCreateNFT(event, collectionAddress, item!)
}

export function handleTransfer(event: Transfer): void {
  // Do not comput mintings
  if (!isMint(event.params.from.toHexString())) {
    handleTransferNFT(event)
  }
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

export function handleApproveCollection(event: Approve): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  collection.isApproved = true

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)
  let itemsCount = collectionContract.itemsCount()

  for (let i = BigInt.fromI32(0); i.lt(itemsCount); i = i.plus(BigInt.fromI32(1))) {
    let graphItemId = getItemId(collectionAddress, i.toHexString())
    let item = Item.load(graphItemId)

    item.searchIsCollectionApproved = true

    item.save()
  }

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