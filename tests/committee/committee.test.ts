import { assert, clearStore, test, describe, afterAll, dataSourceMock, beforeEach } from 'matchstick-as/assembly/index'
import { Address } from '@graphprotocol/graph-ts'
import { handleMemberSet, handleMemberSetLegacy } from '../../src/handlers/committee'
import { createMemberSetEvent } from './utils'

let committeeAddress = Address.fromString('0xaeeC95A8Aa671A6D3fec56594827D7804964fa70')
let oldCommitteeAddress = Address.fromString('0x71d9350Ef44E1e451F00e447C0DfF2d1FB75510a')
let member = Address.fromString('0x967fb0c36E4f5288f30fB05F8b2A4D7b77Eaca4b')

describe('committee', () => {
  beforeEach(() => {
    dataSourceMock.setNetwork('matic')
  })

  afterAll(() => {
    clearStore()
    dataSourceMock.resetValues()
  })

  describe('handleMemberSet (current, authoritative Committee contract)', () => {
    test('sets isCommitteeMember to true when added', () => {
      let event = createMemberSetEvent(committeeAddress, member, true)

      handleMemberSet(event)

      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'true')
    })

    test('sets isCommitteeMember to false when removed', () => {
      let addEvent = createMemberSetEvent(committeeAddress, member, true)
      handleMemberSet(addEvent)
      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'true')

      let removeEvent = createMemberSetEvent(committeeAddress, member, false)
      handleMemberSet(removeEvent)

      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'false')
    })
  })

  describe('handleMemberSetLegacy (deprecated OLD_Committee contract)', () => {
    test('creates the Account but does not set isCommitteeMember for a previously unseen account', () => {
      let event = createMemberSetEvent(oldCommitteeAddress, member, true)

      handleMemberSetLegacy(event)

      // The Account entity is created (so other handlers can still find it),
      // but isCommitteeMember must stay unset — the deprecated contract is not
      // an authoritative source of membership.
      assert.fieldEquals('Account', member.toHex(), 'address', member.toHexString())
      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'false')
    })

    test('does not override isCommitteeMember already set by the current contract', () => {
      let currentEvent = createMemberSetEvent(committeeAddress, member, false)
      handleMemberSet(currentEvent)
      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'false')

      // A stale MemberSet(true) arriving from the deprecated contract must not
      // flip the flag back to true.
      let legacyEvent = createMemberSetEvent(oldCommitteeAddress, member, true)
      handleMemberSetLegacy(legacyEvent)

      assert.fieldEquals('Account', member.toHex(), 'isCommitteeMember', 'false')
    })
  })
})
