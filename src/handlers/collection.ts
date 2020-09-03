import { log, BigInt, Address, ByteArray, Bytes, dataSource } from '@graphprotocol/graph-ts'


import { ProxyCreated } from '../entities/CollectionFactory/CollectionFactory'
import { SetGlobalMinter, SetItemMinter, SetGlobalManager, SetItemManager, AddItem, RescueItem, UpdateItem, Issue, Approve, SetEditable, Complete, CreatorshipTransferred } from '../entities/templates/Collection/CollectionV2'
import { Collection } from '../entities/templates'

export function HandleCollectionCreation(event: ProxyCreated): void {
  Collection.create(event.params._address)
}

export function handleSetGlobalMinter(event: SetGlobalMinter): void {

}

export function handleSetGlobalManager(event: SetGlobalManager): void {

}
export function handleSetItemMinter(event: SetItemMinter): void {

}
export function handleSetItemManager(event: SetItemManager): void {

}
export function handleAddItem(event: AddItem): void {

}
export function handleRescueItem(event: RescueItem): void {

}
export function handleUpdateItem(event: UpdateItem): void {

}
export function handleIssueItem(event: Issue): void {

}
export function handleApproveCollection(event: Approve): void {

}
export function handleSetEditable(event: SetEditable): void {

}

export function handleCompleteCollection(event: Complete): void {

}

export function handleTransferCreatorship(event: CreatorshipTransferred): void {

}