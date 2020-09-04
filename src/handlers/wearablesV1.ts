import { Address } from '@graphprotocol/graph-ts'

import { createAccount } from '../modules/Account'
import { buildWearableFromNFT, getWearableImage } from '../modules/WearableV1'
import { isWearableHead, isWearableAccessory, WEARABLE_OLD_TYPE_SHORT } from '../modules/Metadata'
import {
  getNFTId, cancelActiveOrder,
  clearNFTOrderProperties,
  getTokenURI,
  isMint
} from '../modules/NFT'
import { buildCount, buildCountFromNFT } from '../modules/Count'
import {
  OwnershipTransferred,
  Transfer
} from '../entities/templates/ERC721/ERC721'
import {
  CommunityContestCollection,
  DappcraftMoonminerCollection,
  DCGCollection,
  DCLLaunchCollection,
  DGSummer2020Collection,
  DgtbleHeadspaceCollection,
  ExclusiveMasksCollection,
  Halloween2019Collection,
  MCHCollection,
  Moonshot2020Collection,
  PMOuttathisworldCollection,
  StaySafeCollection,
  WonderzoneMeteorchaserCollection,
  Xmas2019Collection
} from '../wearablesV1/addresses'
import { ERC721 } from '../entities/templates'
import { NFT } from '../entities/schema'


export function handleInitializeWearablesV1(_: OwnershipTransferred): void {
  // Initialize template
  let count = buildCount()

  if (count.started == 0) {
    ERC721.create(Address.fromString(ExclusiveMasksCollection))
    ERC721.create(Address.fromString(Halloween2019Collection))
    ERC721.create(Address.fromString(Xmas2019Collection))
    ERC721.create(Address.fromString(MCHCollection))
    ERC721.create(Address.fromString(CommunityContestCollection))
    ERC721.create(Address.fromString(DCLLaunchCollection))
    ERC721.create(Address.fromString(DCGCollection))
    ERC721.create(Address.fromString(StaySafeCollection))
    ERC721.create(Address.fromString(Moonshot2020Collection))
    ERC721.create(Address.fromString(DappcraftMoonminerCollection))
    ERC721.create(Address.fromString(DGSummer2020Collection))
    ERC721.create(Address.fromString(PMOuttathisworldCollection))
    ERC721.create(Address.fromString(DgtbleHeadspaceCollection))
    ERC721.create(Address.fromString(WonderzoneMeteorchaserCollection))

    count.started = 1
    count.save()
  }
}

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.toString() == '') {
    return
  }

  let contractAddress = event.address.toHexString()
  let id = getNFTId(
    event.address.toHexString(),
    event.params.tokenId.toString()
  )

  let nft = new NFT(id)

  nft.tokenId = event.params.tokenId
  nft.owner = event.params.to.toHex()
  nft.contractAddress = event.address.toHexString()
  nft.updatedAt = event.block.timestamp
  nft.itemType = WEARABLE_OLD_TYPE_SHORT
  nft.tokenURI = getTokenURI(event)

  if (isMint(event.params.to.toHexString())) {
    nft.createdAt = event.block.timestamp
    nft.searchText = ''

    let wearable = buildWearableFromNFT(nft)
    if (wearable.id != '') {
      wearable.save()
      nft.name = wearable.name
      nft.image = getWearableImage(wearable)
      nft.searchIsWearableHead = isWearableHead(wearable.category)
      nft.searchIsWearableAccessory = isWearableAccessory(wearable.category)
      nft.searchWearableCategory = wearable.category
      nft.searchWearableBodyShapes = wearable.bodyShapes
      nft.searchWearableRarity = wearable.rarity
      // nft.searchText = toLowerCase(wearable.name)
    }

    let metric = buildCountFromNFT()
    metric.save()
  } else {
    let oldNFT = NFT.load(id)
    if (cancelActiveOrder(oldNFT!, event.block.timestamp)) {
      nft = clearNFTOrderProperties(nft!)
    }
  }

  createAccount(event.params.to)

  nft.save()
}