import { assert, clearStore, test, describe, afterAll, dataSourceMock } from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleSetGlobalMinter } from '../../src/handlers/collection'
import { addresses, createCollection, createSetGlobalMinterEvent } from './utils'
import { getStoreAddress } from '../../src/modules/store'

describe('collection', () => {
  afterAll(() => {
    clearStore()
    dataSourceMock.resetValues()
  })

  describe('handleSetGlobalMinter', () => {
    describe('when the minter is the store', () => {
      describe('and firstListedAt is null', () => {
        test('should set firstListedAt timestamp', () => {
          dataSourceMock.setNetwork('matic')

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
      })

      describe('and firstListedAt has a value', () => {
        test('should keep current firstListedAt value', () => {
          dataSourceMock.setNetwork('matic')

          let minter = Address.fromString(getStoreAddress())
          let firstListedAt = BigInt.fromI32(100)

          let collectionAddress = addresses[0]
          let collectionId = collectionAddress.toHexString()
          let collection = createCollection(collectionId)

          collection.firstListedAt = firstListedAt

          collection.save()

          let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

          handleSetGlobalMinter(setGlobalMinterEvent)

          assert.fieldEquals('Collection', collectionId, 'firstListedAt', firstListedAt.toString())
        })
      })
    })

    describe('when the minter is not the store', () => {
      test('should keep firstListedAt as null', () => {
        dataSourceMock.setNetwork('matic')

        let minter = addresses[1]
        let firstListedAt: BigInt | null = null

        let collectionAddress = addresses[0]
        let collectionId = collectionAddress.toHexString()
        let collection = createCollection(collectionId)

        collection.firstListedAt = firstListedAt

        collection.save()

        let setGlobalMinterEvent = createSetGlobalMinterEvent(collectionAddress, minter, true)

        handleSetGlobalMinter(setGlobalMinterEvent)

        assert.fieldEquals('Collection', collectionId, 'firstListedAt', 'null')
      })
    })
  })
})
