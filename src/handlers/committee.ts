import {
  MemberSet,
} from '../entities/Committee/Committee'
import { createOrLoadAccount } from '../modules/Account'

// Handles MemberSet events from the current, authoritative Committee contract
// (the one CollectionManager.committee() actually points to on-chain). This is
// the sole source of truth for Account.isCommitteeMember going forward.
export function handleMemberSet(event: MemberSet): void {
  let account = createOrLoadAccount(event.params._member)

  account.isCommitteeMember = event.params._value

  account.save()
}

// Handles MemberSet events from the deprecated OLD_Committee contract.
// That contract is no longer referenced by CollectionManager and is not
// authoritative for curation permissions, so it must not write
// Account.isCommitteeMember — doing so could leave the flag permanently
// stale once the old contract stops receiving new membership changes.
// Still load/create the Account so any historical event data continues to
// resolve to an entity.
export function handleMemberSetLegacy(event: MemberSet): void {
  createOrLoadAccount(event.params._member)
}
