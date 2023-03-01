import { assert, clearStore, test, describe, afterAll, dataSourceMock, beforeEach } from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleSetGlobalMinter, handleSetItemMinter } from '../../src/handlers/collection'
import { addresses, createCollection, createItem, createSetGlobalMinterEvent, createSetItemMinterEvent } from './utils'
import { getStoreAddress } from '../../src/modules/Store'
import { getItemId } from '../../src/modules/item'

describe('collection', () => {
  beforeEach(() => {
    dataSourceMock.setNetwork('matic')
  })

  afterAll(() => {
    clearStore()
    dataSourceMock.resetValues()
  })

  describe('handleSetGlobalMinter', () => {
    test('should set firstListedAt when minter is the store', () => {
      let minter = Address.fromString(getStoreAddress())
      let firstListedAt: BigInt | null = null

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.firstListedAt = firstListedAt

      collection.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Collection', collectionId, 'firstListedAt', setGlobalMinterEvent.block.timestamp.toString())
    })

    test('should keep firstListedAt if it is not null', () => {
      let minter = Address.fromString(getStoreAddress())
      let firstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.firstListedAt = firstListedAt

      collection.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Collection', collectionId, 'firstListedAt', (firstListedAt as BigInt).toString())
    })

    test('should keep firstListedAt if the minter is not the store', () => {
      let minter = addresses[1]
      let firstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.firstListedAt = firstListedAt

      collection.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Collection', collectionId, 'firstListedAt', (firstListedAt as BigInt).toString())
    })

    test('should set item firstListedAt when the minter is the store', () => {
      let minter = Address.fromString(getStoreAddress())
      let itemFirstListedAt: BigInt | null = null

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.itemsCount = 1

      collection.save()

      let itemId = getItemId(collectionId, '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', setGlobalMinterEvent.block.timestamp.toString())
    })

    test('should keep item firstListedAt if it is not null', () => {
      let minter = Address.fromString(getStoreAddress())
      let itemFirstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.itemsCount = 1

      collection.save()

      let itemId = getItemId(collectionId, '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', (itemFirstListedAt as BigInt).toString())
    })

    test('should keep item firstListedAt if the minter is not the store', () => {
      let minter = addresses[1]
      let itemFirstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]
      let collectionId = collectionAddress.toHexString()
      let collection = createCollection(collectionId)

      collection.itemsCount = 1

      collection.save()

      let itemId = getItemId(collectionId, '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

      handleSetGlobalMinter(setGlobalMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', (itemFirstListedAt as BigInt).toString())
    })
  })

  describe('handleSetItemMinter', () => {
    test('should set firstListedAt when the minter is the store', () => {
      let minter = Address.fromString(getStoreAddress())
      let itemFirstListedAt: BigInt | null = null

      let collectionAddress = addresses[0]

      let itemId = getItemId(collectionAddress.toHexString(), '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setItemMinterEvent = createSetItemMinterEvent(collectionAddress, '0', minter, '1')

      handleSetItemMinter(setItemMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', setItemMinterEvent.block.timestamp.toString())
    })

    test('should keep firstListedAt if it is not null', () => {
      let minter = Address.fromString(getStoreAddress())
      let itemFirstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]

      let itemId = getItemId(collectionAddress.toHexString(), '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setItemMinterEvent = createSetItemMinterEvent(collectionAddress, '0', minter, '1')

      handleSetItemMinter(setItemMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', (itemFirstListedAt as BigInt).toString())
    })

    test('should keep firstListedAt if the minter is not the store', () => {
      let minter = addresses[1]
      let itemFirstListedAt = BigInt.fromI32(100)

      let collectionAddress = addresses[0]

      let itemId = getItemId(collectionAddress.toHexString(), '0')
      let item = createItem(itemId)

      item.firstListedAt = itemFirstListedAt

      item.save()

      let setItemMinterEvent = createSetItemMinterEvent(collectionAddress, '0', minter, '1')

      handleSetItemMinter(setItemMinterEvent)

      assert.fieldEquals('Item', itemId, 'firstListedAt', (itemFirstListedAt as BigInt).toString())
    })
  })
})
