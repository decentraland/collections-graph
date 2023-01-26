import { BigInt, Address, log } from '@graphprotocol/graph-ts'
import { handleMintNFT, handleTransferNFT } from './nft'
import { setItemSearchFields, buildItemMetadata } from '../modules/Metadata'
import { buildCount, buildCountFromItem, buildCountFromCollection } from '../modules/Count'
import { getItemId, getItemImage, removeItemMinter } from '../modules/Item'
import { createOrLoadAccount } from '../modules/Account'
import { getCollectionsV1 } from '../data/wearablesV1/addresses'
import { isMint } from '../modules/NFT'
import { Collection, Curation, Item, Rarity } from '../entities/schema'
import { ProxyCreated, OwnershipTransferred } from '../entities/CollectionFactory/CollectionFactory'
import {
  SetGlobalMinter,
  SetItemMinter,
  SetGlobalManager,
  SetItemManager,
  AddItem,
  RescueItem,
  UpdateItemData,
  Issue,
  SetApproved,
  SetEditable,
  Complete,
  CreatorshipTransferred,
  CollectionV2 as CollectionContract,
  Transfer
} from '../entities/templates/CollectionV2/CollectionV2'
import { ERC721 } from '../entities/templates'
import { CollectionV2 } from '../entities/templates'
import { RaritiesWithOracle } from '../entities/RaritiesWithOracle/RaritiesWithOracle'
import { getURNForWearableV2, getURNForCollectionV2 } from '../modules/Metadata/wearable'
import { getStoreAddress } from '../modules/store'
import { getOrCreateAnalyticsDayData } from '../modules/analytics'
import { getCurationId, getBlockWhereRescueItemsStarted } from '../modules/Curation'
import { toLowerCase } from '../utils'
import { getRaritiesWithOracleAddress } from '../modules/rarity'

export function handleInitializeWearablesV1(_: OwnershipTransferred): void {
  let count = buildCount()

  let collectionsV1 = getCollectionsV1()

  if (count.started == 0) {
    collectionsV1.forEach(collectionAddress => {
      // Create template bindings
      ERC721.create(Address.fromString(collectionAddress))
    })

    count.collectionTotal += collectionsV1.length
  }

  count.started = 1
  count.save()
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
  collection.urn = getURNForCollectionV2(collectionAddress)
  collection.itemsCount = 0
  collection.createdAt = event.block.timestamp // to support old collections
  collection.updatedAt = event.block.timestamp // to support old collections
  collection.reviewedAt = event.block.timestamp // to support old collections
  collection.searchIsStoreMinter = false
  collection.searchText = toLowerCase(collection.name)
  collection.save()

  let metric = buildCountFromCollection()
  metric.save()

  let creatorAccount = createOrLoadAccount(Address.fromString(collection.creator))
  creatorAccount.collections += 1
  creatorAccount.save()
}

export function handleAddItem(event: AddItem): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  if (collection == null) {
    // Skip it, collection will be set up once the proxy event is created
    // The ProxyCreated event is emitted right after the collection's event
    return
  }

  // Count item
  collection.itemsCount += 1
  collection.save()

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)

  let contractItem = event.params._item
  let itemId = event.params._itemId.toString()

  let id = getItemId(collectionAddress, itemId.toString())
  let rarity = Rarity.load(contractItem.rarity)
  let creationFee = BigInt.fromI32(0)

  if (!rarity) {
    log.warning('Undefined rarity {} for collection {} and item {}', [contractItem.rarity, collectionAddress, itemId.toString()])
  } else {
    creationFee = rarity.price

    if (rarity.currency == 'USD') {
      let raritiesWithOracle = RaritiesWithOracle.bind(getRaritiesWithOracleAddress())
      let result = raritiesWithOracle.getRarityByName(rarity.name)

      creationFee = result.price
    }
  }

  let item = new Item(id)
  item.creator = collection.creator
  item.blockchainId = event.params._itemId
  item.collection = collectionAddress
  item.creationFee = creationFee
  item.rarity = contractItem.rarity
  item.available = contractItem.maxSupply
  item.totalSupply = contractItem.totalSupply
  item.maxSupply = contractItem.maxSupply
  item.price = contractItem.price
  item.beneficiary = contractItem.beneficiary.toHexString()
  item.contentHash = contractItem.contentHash
  item.rawMetadata = contractItem.metadata
  item.searchIsCollectionApproved = collectionContract.isApproved()
  item.URI = collectionContract.baseURI() + collectionContract.getChainId().toString() + '/' + collectionAddress + '/' + itemId
  item.urn = getURNForWearableV2(collectionAddress, itemId.toString())
  item.image = getItemImage(item)
  item.minters = []
  item.managers = []
  item.searchIsStoreMinter = false
  item.createdAt = event.block.timestamp
  item.updatedAt = event.block.timestamp
  item.reviewedAt = event.block.timestamp
  item.soldAt = null
  item.sales = 0
  item.volume = BigInt.fromI32(0)
  item.uniqueCollectors = []
  item.uniqueCollectorsTotal = 0

  let metadata = buildItemMetadata(item)

  item.metadata = metadata.id
  item.itemType = metadata.itemType

  item = setItemSearchFields(item)
  item.save()

  let metric = buildCountFromItem()
  metric.save()

  // tracks the number of items created by the creator and fees to DAO
  let analyticsDayData = getOrCreateAnalyticsDayData(event.block.timestamp)
  analyticsDayData.daoEarnings = analyticsDayData.daoEarnings.plus(creationFee)
  analyticsDayData.save()
}

export function handleRescueItem(event: RescueItem): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toString()

  let id = getItemId(collectionAddress, itemId)

  let item = Item.load(id)
  let isNewContent: boolean
  if (item != null) {
    isNewContent = item.contentHash != event.params._contentHash

    item.rawMetadata = event.params._metadata
    item.contentHash = event.params._contentHash

    let metadata = buildItemMetadata(item)

    item.metadata = metadata.id
    item.itemType = metadata.itemType

    item = setItemSearchFields(item)

    item.updatedAt = event.block.timestamp

    item.save()
  }

  let collection = Collection.load(collectionAddress)

  if (collection != null) {
    collection.updatedAt = event.block.timestamp
    collection.reviewedAt = event.block.timestamp
    collection.save()
  }

  let block = getBlockWhereRescueItemsStarted()
  if ((isNewContent && event.block.number.gt(block)) || event.block.number.equals(block)) {
    // Create curation
    let txInput = event.transaction.input.toHexString()
    // forwardMetaTx(address _target, bytes calldata _data) or manageCollection(address,address,address,bytes[]) selector
    if (txInput.startsWith('0x07bd3522') || txInput.startsWith('0x81c9308e')) {
      let curationId = getCurationId(collectionAddress, event.transaction.hash.toHexString(), event.logIndex.toString())
      let curation = new Curation(curationId)
      let curator = ''
      if (txInput.startsWith('0x81c9308e')) {
        // manageCollection(address,address,address,bytes[]) selector
        curator = event.transaction.from.toHexString()
      } else {
        // executeMetaTransaction(address,bytes,bytes32,bytes32,uint8) selector
        let index = BigInt.fromI32(txInput.indexOf('0c53c51c'))

        // Sender is the first parameter of the executeMetaTransaction
        curator = '0x' + txInput.substr(index.plus(BigInt.fromI32(32)).toI32(), 40)
      }

      curation.curator = curator
      curation.collection = collectionAddress
      curation.item = itemId
      curation.isApproved = true
      curation.txHash = event.transaction.hash
      curation.timestamp = event.block.timestamp

      curation.save()

      // Increase total curations
      let account = createOrLoadAccount(Address.fromString(curator))

      account.totalCurations += 1

      account.save()
    }
  }
}

export function handleUpdateItemData(event: UpdateItemData): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toString()
  let id = getItemId(collectionAddress, itemId)

  let item = Item.load(id)
  if (item != null) {
    item.price = event.params._price
    item.beneficiary = event.params._beneficiary.toHexString()
    item.rawMetadata = event.params._metadata

    let metadata = buildItemMetadata(item)

    item.metadata = metadata.id
    item.itemType = metadata.itemType
    item = setItemSearchFields(item)

    item.updatedAt = event.block.timestamp
    item.save()
  }
}

export function handleIssue(event: Issue): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toString()
  let id = getItemId(collectionAddress, itemId)

  let item = Item.load(id)

  if (item !== null) {
    item.available = item.available.minus(BigInt.fromI32(1))
    item.totalSupply = item.totalSupply.plus(BigInt.fromI32(1))

    item.save()
    handleMintNFT(event, collectionAddress, item)
  }

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)
  let isGlobalMinter = collectionContract.globalMinters(event.params._caller)

  if (isGlobalMinter) {
    return
  }

  let amountOfMintsAvailable = collectionContract.itemMinters(event.params._itemId, event.params._caller)

  if (amountOfMintsAvailable.equals(BigInt.fromI32(0)) && item != null) {
    let minterAddress = event.params._caller.toHexString()
    item.minters = removeItemMinter(item, minterAddress)
    // unset flag if minter is store
    if (minterAddress == getStoreAddress()) {
      item.searchIsStoreMinter = false
    }
    item.save()
  }
}

export function handleTransfer(event: Transfer): void {
  // Do not compute mints
  if (!isMint(event.params.from.toHexString())) {
    handleTransferNFT(event)
  }
}

export function handleSetGlobalMinter(event: SetGlobalMinter): void {
  let collectionAddress = event.address.toHexString()
  let storeAddress = getStoreAddress()
  let minterAddress = event.params._minter.toHexString()
  let collection = Collection.load(collectionAddress)

  if (!collection) {
    return
  }

  let minters = collection.minters

  if (event.params._value == true && minters != null) {
    minters.push(event.params._minter.toHexString())
    collection.minters = minters

    // set flag on collection
    if (minterAddress == storeAddress) {
      collection.searchIsStoreMinter = true
      // loop over all items and set flag
      let itemCount = collection.itemsCount
      for (let i = 0; i < itemCount; i++) {
        let itemId = getItemId(collectionAddress, i.toString())
        let item = Item.load(itemId)
        if (item != null) {
          item.searchIsStoreMinter = true

          if (item.firstListedAt == null) {
            item.firstListedAt = event.block.timestamp
          }

          item.save()
        }
      }
    }
  } else {
    let newMinters = new Array<string>(0)

    for (let i = 0; i < minters.length; i++) {
      if (minters[i] != event.params._minter.toHexString()) {
        newMinters.push(minters[i])
      }
    }

    // unset flag on collection
    if (minterAddress == storeAddress) {
      collection.searchIsStoreMinter = false
      // loop over all items and unset flag (only if store is not an item minter)
      let itemCount = collection.itemsCount
      for (let i = 0; i < itemCount; i++) {
        let itemId = getItemId(collectionAddress, i.toString())
        let item = Item.load(itemId)
        if (item != null) {
          // check if store is item minter
          let isStoreItemMinter = false
          let itemMinters = item.minters
          for (let j = 0; j < item.minters.length; j++) {
            if (storeAddress == itemMinters[i]) {
              isStoreItemMinter = true
            }
          }
          // set flag only if store is item minter, otherwise unset it
          item.searchIsStoreMinter = isStoreItemMinter
          item.save()
        }
      }
    }

    collection.minters = newMinters
  }

  collection.save()
}

export function handleSetGlobalManager(event: SetGlobalManager): void {
  let collection = Collection.load(event.address.toHexString())

  if (!collection) {
    return
  }

  let managers = collection.managers

  if (event.params._value == true && managers != null) {
    managers.push(event.params._manager.toHexString())
    collection.managers = managers
  } else {
    let newManagers = new Array<string>(0)

    for (let i = 0; i < managers.length; i++) {
      if (managers[i] != event.params._manager.toHexString()) {
        newManagers.push(managers[i])
      }
    }

    collection.managers = newManagers
  }

  collection.save()
}

export function handleSetItemMinter(event: SetItemMinter): void {
  let collectionAddress = event.address.toHexString()
  let storeAddress = getStoreAddress()
  let minterAddress = event.params._minter.toHexString()
  let itemId = event.params._itemId.toString()
  let id = getItemId(collectionAddress, itemId)

  let item = Item.load(id)
  if (!item) {
    return
  }

  let minters = item.minters

  if (event.params._value.gt(BigInt.fromI32(0))) {
    minters.push(minterAddress)
    item.minters = minters
    // if minter is store address, set flag
    if (minterAddress == storeAddress) {
      item.searchIsStoreMinter = true
    }
  } else {
    item.minters = removeItemMinter(item, minterAddress)
    // if minter is store address, unset flag, but only if store is not global minter
    let collection = Collection.load(item.collection)
    if (collection != null && !collection.searchIsStoreMinter && minterAddress == storeAddress) {
      item.searchIsStoreMinter = false
    }
  }

  item.save()
}

export function handleSetItemManager(event: SetItemManager): void {
  let collectionAddress = event.address.toHexString()
  let itemId = event.params._itemId.toString()
  let id = getItemId(collectionAddress, itemId)

  let item = Item.load(id)
  if (!item) {
    return
  }

  let managers = item.managers

  if (event.params._value == true && managers != null) {
    managers.push(event.params._manager.toHexString())
    item.managers = managers
  } else {
    let newManagers = new Array<string>(0)

    for (let i = 0; i < managers.length; i++) {
      if (managers[i] != event.params._manager.toHexString()) {
        newManagers.push(managers[i])
      }
    }

    item.managers = newManagers
  }

  item.save()
}

export function handleSetApproved(event: SetApproved): void {
  let collectionAddress = event.address.toHexString()
  let collection = Collection.load(collectionAddress)

  if (!collection) {
    return
  }

  collection.isApproved = event.params._newValue

  // Bind contract
  let collectionContract = CollectionContract.bind(event.address)
  let itemsCount = collectionContract.itemsCount()

  for (let i = BigInt.fromI32(0); i.lt(itemsCount); i = i.plus(BigInt.fromI32(1))) {
    let id = getItemId(collectionAddress, i.toString())
    let item = Item.load(id)
    if (item) {
      item.searchIsCollectionApproved = event.params._newValue
      item.reviewedAt = event.block.timestamp
      item.save()
    }
  }

  collection.updatedAt = event.block.timestamp // to support old collections
  collection.reviewedAt = event.block.timestamp // to support old collections
  collection.save()

  let block = getBlockWhereRescueItemsStarted()
  if (event.block.number.lt(block)) {
    // Create curation
    let txInput = event.transaction.input.toHexString()
    // forwardMetaTx(address _target, bytes calldata _data) or manageCollection(address,address,address,bytes[]) selector
    if (txInput.startsWith('0x07bd3522') || txInput.startsWith('0x81c9308e')) {
      let curationId = getCurationId(collectionAddress, event.transaction.hash.toHexString(), event.logIndex.toString())
      let curation = new Curation(curationId)
      let curator = ''
      if (txInput.startsWith('0x81c9308e')) {
        // manageCollection(address,address,address,bytes[]) selector
        curator = event.transaction.from.toHexString()
      } else {
        // executeMetaTransaction(address,bytes,bytes32,bytes32,uint8) selector
        let index = BigInt.fromI32(txInput.indexOf('0c53c51c'))

        // Sender is the first parameter of the executeMetaTransaction
        curator = '0x' + txInput.substr(index.plus(BigInt.fromI32(32)).toI32(), 40)
      }

      curation.curator = curator
      curation.collection = collectionAddress
      curation.isApproved = event.params._newValue
      curation.txHash = event.transaction.hash
      curation.timestamp = event.block.timestamp

      curation.save()

      // Increase total curations
      let account = createOrLoadAccount(Address.fromString(curator))

      account.totalCurations += 1

      account.save()
    }
  }
}

export function handleSetEditable(event: SetEditable): void {
  let collection = Collection.load(event.address.toHexString())
  if (collection != null) {
    collection.isEditable = event.params._newValue
    collection.save()
  }
}

export function handleCompleteCollection(event: Complete): void {
  let collection = Collection.load(event.address.toHexString())
  if (collection != null) {
    collection.isCompleted = true
    collection.save()
  }
}

export function handleTransferCreatorship(event: CreatorshipTransferred): void {
  let collection = Collection.load(event.address.toHexString())
  let newCreator = event.params._newCreator.toHexString()
  if (collection != null) {
    collection.creator = newCreator
    let itemCount = collection.itemsCount
    for (let i = 0; i < itemCount; i++) {
      let itemId = getItemId(collection.id, i.toString())
      let item = Item.load(itemId)
      if (item != null) {
        item.creator = newCreator
        item.save()
      }
    }
    collection.save()
  }
}

export function handleTransferOwnership(event: OwnershipTransferred): void {
  let collection = Collection.load(event.address.toHexString())
  if (collection != null) {
    collection.owner = event.params.newOwner.toHexString()
    collection.save()
  }
}
