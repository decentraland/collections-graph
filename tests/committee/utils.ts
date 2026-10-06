import { Address, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as'
import { MemberSet } from '../../src/entities/Committee/Committee'

export function createMemberSetEvent(source: Address, member: Address, value: boolean): MemberSet {
  let ev: MemberSet = changetype<MemberSet>(newMockEvent())

  ev.address = source

  ev.parameters = new Array()

  let memberParam = new ethereum.EventParam('_member', ethereum.Value.fromAddress(member))
  let valueParam = new ethereum.EventParam('_value', ethereum.Value.fromBoolean(value))

  ev.parameters.push(memberParam)
  ev.parameters.push(valueParam)

  return ev
}
