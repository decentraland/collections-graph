import { assert, clearStore, test, describe, afterAll, dataSourceMock, beforeEach } from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleSetGlobalMinter, handleSetItemMinter } from '../../src/handlers/collection'
import { addresses, createCollection, createItem, createSetGlobalMinterEvent, createSetItemMinterEvent } from './utils'
import { getStoreAddress } from '../../src/modules/store'
import { getItemId } from '../../src/modules/Item'

let minter: Address
let firstListedAt: BigInt | null
let itemFirstListedAt: BigInt | null

describe('collection', () => {
  afterAll(() => {
    clearStore()
    dataSourceMock.resetValues()
  })

  describe('handleSetGlobalMinter', () => {
    describe('when the network is matic', () => {
      beforeEach(() => {
        dataSourceMock.setNetwork('matic')
      })

      describe('when the minter is the store', () => {
        beforeEach(() => {
          minter = Address.fromString(getStoreAddress())
        })

        describe('when firstListedAt is null', () => {
          beforeEach(() => {
            firstListedAt = null
          })

          test('should set firstListedAt timestamp', () => {
            let collectionAddress = addresses[0]
            let collectionId = collectionAddress.toHexString()
            let collection = createCollection(collectionId)

            collection.firstListedAt = firstListedAt

            collection.save()

            let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

            handleSetGlobalMinter(setGlobalMinterEvent)

            assert.fieldEquals('Collection', collectionId, 'firstListedAt', setGlobalMinterEvent.block.timestamp.toString())
          })

          describe('when the item firstListedAt is null', () => {
            beforeEach(() => {
              itemFirstListedAt = null
            })

            test('should set the item firstListedAt timestamp', () => {
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
          })

          describe('when the item firstListedAt has a value', () => {
            beforeEach(() => {
              itemFirstListedAt = BigInt.fromI32(100)
            })

            test('should keep current item firstListedAt value', () => {
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
        })

        describe('when firstListedAt has a value', () => {
          beforeEach(() => {
            firstListedAt = BigInt.fromI32(100)
          })

          test('should keep current firstListedAt value', () => {
            let collectionAddress = addresses[0]
            let collectionId = collectionAddress.toHexString()
            let collection = createCollection(collectionId)

            collection.firstListedAt = firstListedAt

            collection.save()

            let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

            handleSetGlobalMinter(setGlobalMinterEvent)

            assert.fieldEquals('Collection', collectionId, 'firstListedAt', (firstListedAt as BigInt).toString())
          })
        })
      })

      describe('when the minter is not the store', () => {
        beforeEach(() => {
          minter = addresses[1]
        })

        describe('when firstListedAt is null', () => {
          beforeEach(() => {
            firstListedAt = null
          })

          test('should keep firstListedAt as null', () => {
            let collectionAddress = addresses[0]
            let collectionId = collectionAddress.toHexString()
            let collection = createCollection(collectionId)

            collection.firstListedAt = firstListedAt

            collection.save()

            let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

            handleSetGlobalMinter(setGlobalMinterEvent)

            assert.fieldEquals('Collection', collectionId, 'firstListedAt', 'null')
          })

          describe('when the item firstListedAt is null', () => {
            beforeEach(() => {
              itemFirstListedAt = null
            })

            test('should keep item firstListedAt as null', () => {
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

              assert.fieldEquals('Item', itemId, 'firstListedAt', 'null')
            })
          })
        })
      })
    })
  })

  describe('handleSetItemMinter', () => {
    describe('when the network is matic', () => {
      beforeEach(() => {
        dataSourceMock.setNetwork('matic')
      })

      describe('when the minter is the store', () => {
        beforeEach(() => {
          minter = Address.fromString(getStoreAddress())
        })

        describe('when the item firstListedAt is null', () => {
          beforeEach(() => {
            itemFirstListedAt = null
          })

          test('should set the item firstListedAt timestamp', () => {
            let collectionAddress = addresses[0]

            let itemId = getItemId(collectionAddress.toHexString(), '0')
            let item = createItem(itemId)

            item.firstListedAt = itemFirstListedAt

            item.save()

            let setItemMinterEvent = createSetItemMinterEvent(collectionAddress, '0', minter, '1')

            handleSetItemMinter(setItemMinterEvent)

            assert.fieldEquals('Item', itemId, 'firstListedAt', setItemMinterEvent.block.timestamp.toString())
          })
        })

        describe('when the item firstListedAt has value', () => {
          beforeEach(() => {
            itemFirstListedAt = BigInt.fromI32(100)
          })

          test('should keep the current value of firstListedAt timestamp', () => {
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

      describe('when the minter is not the store', () => {
        beforeEach(() => {
          minter = addresses[1]
        })

        describe('when the item firstListedAt is null', () => {
          beforeEach(() => {
            itemFirstListedAt = null
          })

          test('should keep item firstListedAt as null', () => {
            let collectionAddress = addresses[0]

            let itemId = getItemId(collectionAddress.toHexString(), '0')
            let item = createItem(itemId)

            item.firstListedAt = itemFirstListedAt

            item.save()

            let setItemMinterEvent = createSetItemMinterEvent(collectionAddress, '0', minter, '1')

            handleSetItemMinter(setItemMinterEvent)

            assert.fieldEquals('Item', itemId, 'firstListedAt', 'null')
          })
        })
      })
    })
  })
})
