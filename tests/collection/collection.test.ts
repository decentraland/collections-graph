import { assert, clearStore, test, describe, afterAll, dataSourceMock, beforeEach } from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { handleSetGlobalMinter } from '../../src/handlers/collection'
import { addresses, createCollection, createSetGlobalMinterEvent } from './utils'
import { getStoreAddress } from '../../src/modules/store'

let minter: Address
let firstListedAt: BigInt | null

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
        })
      })
    })
  })
})
