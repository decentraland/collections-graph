import {
  MemberSet,
} from '../entities/Committee/Committee'
import { createOrLoadAccount } from '../modules/Account'



export function handleMemeberSet(event: MemberSet): void {
  let account = createOrLoadAccount(event.params._member)

  account.isCommitteeMember = event.params._value

  account.save()
}
