// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Collection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Collection entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Collection entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Collection", id.toString(), this);
  }

  static load(id: string): Collection | null {
    return store.get("Collection", id) as Collection | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get items(): Array<string> | null {
    let value = this.get("items");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set items(value: Array<string> | null) {
    if (value === null) {
      this.unset("items");
    } else {
      this.set("items", Value.fromStringArray(value as Array<string>));
    }
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get creator(): string | null {
    let value = this.get("creator");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set creator(value: string | null) {
    if (value === null) {
      this.unset("creator");
    } else {
      this.set("creator", Value.fromString(value as string));
    }
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get isCompleted(): boolean {
    let value = this.get("isCompleted");
    return value.toBoolean();
  }

  set isCompleted(value: boolean) {
    this.set("isCompleted", Value.fromBoolean(value));
  }

  get isApproved(): boolean {
    let value = this.get("isApproved");
    return value.toBoolean();
  }

  set isApproved(value: boolean) {
    this.set("isApproved", Value.fromBoolean(value));
  }

  get isEditable(): boolean {
    let value = this.get("isEditable");
    return value.toBoolean();
  }

  set isEditable(value: boolean) {
    this.set("isEditable", Value.fromBoolean(value));
  }

  get minters(): Array<string> | null {
    let value = this.get("minters");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set minters(value: Array<string> | null) {
    if (value === null) {
      this.unset("minters");
    } else {
      this.set("minters", Value.fromStringArray(value as Array<string>));
    }
  }

  get managers(): Array<string> | null {
    let value = this.get("managers");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set managers(value: Array<string> | null) {
    if (value === null) {
      this.unset("managers");
    } else {
      this.set("managers", Value.fromStringArray(value as Array<string>));
    }
  }

  get itemsCount(): i32 {
    let value = this.get("itemsCount");
    return value.toI32();
  }

  set itemsCount(value: i32) {
    this.set("itemsCount", Value.fromI32(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }
}

export class Item extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Item entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Item entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Item", id.toString(), this);
  }

  static load(id: string): Item | null {
    return store.get("Item", id) as Item | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get blockchainId(): BigInt {
    let value = this.get("blockchainId");
    return value.toBigInt();
  }

  set blockchainId(value: BigInt) {
    this.set("blockchainId", Value.fromBigInt(value));
  }

  get itemType(): string {
    let value = this.get("itemType");
    return value.toString();
  }

  set itemType(value: string) {
    this.set("itemType", Value.fromString(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get maxSupply(): BigInt {
    let value = this.get("maxSupply");
    return value.toBigInt();
  }

  set maxSupply(value: BigInt) {
    this.set("maxSupply", Value.fromBigInt(value));
  }

  get rarity(): string {
    let value = this.get("rarity");
    return value.toString();
  }

  set rarity(value: string) {
    this.set("rarity", Value.fromString(value));
  }

  get available(): BigInt {
    let value = this.get("available");
    return value.toBigInt();
  }

  set available(value: BigInt) {
    this.set("available", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get beneficiary(): string {
    let value = this.get("beneficiary");
    return value.toString();
  }

  set beneficiary(value: string) {
    this.set("beneficiary", Value.fromString(value));
  }

  get contentHash(): Bytes | null {
    let value = this.get("contentHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set contentHash(value: Bytes | null) {
    if (value === null) {
      this.unset("contentHash");
    } else {
      this.set("contentHash", Value.fromBytes(value as Bytes));
    }
  }

  get URI(): string {
    let value = this.get("URI");
    return value.toString();
  }

  set URI(value: string) {
    this.set("URI", Value.fromString(value));
  }

  get image(): string | null {
    let value = this.get("image");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set image(value: string | null) {
    if (value === null) {
      this.unset("image");
    } else {
      this.set("image", Value.fromString(value as string));
    }
  }

  get minters(): Array<string> | null {
    let value = this.get("minters");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set minters(value: Array<string> | null) {
    if (value === null) {
      this.unset("minters");
    } else {
      this.set("minters", Value.fromStringArray(value as Array<string>));
    }
  }

  get managers(): Array<string> | null {
    let value = this.get("managers");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set managers(value: Array<string> | null) {
    if (value === null) {
      this.unset("managers");
    } else {
      this.set("managers", Value.fromStringArray(value as Array<string>));
    }
  }

  get metadata(): string | null {
    let value = this.get("metadata");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set metadata(value: string | null) {
    if (value === null) {
      this.unset("metadata");
    } else {
      this.set("metadata", Value.fromString(value as string));
    }
  }

  get rawMetadata(): string {
    let value = this.get("rawMetadata");
    return value.toString();
  }

  set rawMetadata(value: string) {
    this.set("rawMetadata", Value.fromString(value));
  }

  get urn(): string {
    let value = this.get("urn");
    return value.toString();
  }

  set urn(value: string) {
    this.set("urn", Value.fromString(value));
  }

  get nfts(): Array<string> | null {
    let value = this.get("nfts");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set nfts(value: Array<string> | null) {
    if (value === null) {
      this.unset("nfts");
    } else {
      this.set("nfts", Value.fromStringArray(value as Array<string>));
    }
  }

  get searchText(): string | null {
    let value = this.get("searchText");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchText(value: string | null) {
    if (value === null) {
      this.unset("searchText");
    } else {
      this.set("searchText", Value.fromString(value as string));
    }
  }

  get searchItemType(): string | null {
    let value = this.get("searchItemType");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchItemType(value: string | null) {
    if (value === null) {
      this.unset("searchItemType");
    } else {
      this.set("searchItemType", Value.fromString(value as string));
    }
  }

  get searchIsCollectionApproved(): boolean {
    let value = this.get("searchIsCollectionApproved");
    return value.toBoolean();
  }

  set searchIsCollectionApproved(value: boolean) {
    this.set("searchIsCollectionApproved", Value.fromBoolean(value));
  }

  get searchIsWearableHead(): boolean {
    let value = this.get("searchIsWearableHead");
    return value.toBoolean();
  }

  set searchIsWearableHead(value: boolean) {
    this.set("searchIsWearableHead", Value.fromBoolean(value));
  }

  get searchIsWearableAccessory(): boolean {
    let value = this.get("searchIsWearableAccessory");
    return value.toBoolean();
  }

  set searchIsWearableAccessory(value: boolean) {
    this.set("searchIsWearableAccessory", Value.fromBoolean(value));
  }

  get searchWearableCategory(): string | null {
    let value = this.get("searchWearableCategory");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchWearableCategory(value: string | null) {
    if (value === null) {
      this.unset("searchWearableCategory");
    } else {
      this.set("searchWearableCategory", Value.fromString(value as string));
    }
  }

  get searchWearableRarity(): string | null {
    let value = this.get("searchWearableRarity");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchWearableRarity(value: string | null) {
    if (value === null) {
      this.unset("searchWearableRarity");
    } else {
      this.set("searchWearableRarity", Value.fromString(value as string));
    }
  }

  get searchWearableBodyShapes(): Array<string> | null {
    let value = this.get("searchWearableBodyShapes");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set searchWearableBodyShapes(value: Array<string> | null) {
    if (value === null) {
      this.unset("searchWearableBodyShapes");
    } else {
      this.set(
        "searchWearableBodyShapes",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }
}

export class NFT extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save NFT entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save NFT entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("NFT", id.toString(), this);
  }

  static load(id: string): NFT | null {
    return store.get("NFT", id) as NFT | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get contractAddress(): string {
    let value = this.get("contractAddress");
    return value.toString();
  }

  set contractAddress(value: string) {
    this.set("contractAddress", Value.fromString(value));
  }

  get itemBlockchainId(): BigInt | null {
    let value = this.get("itemBlockchainId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set itemBlockchainId(value: BigInt | null) {
    if (value === null) {
      this.unset("itemBlockchainId");
    } else {
      this.set("itemBlockchainId", Value.fromBigInt(value as BigInt));
    }
  }

  get issuedId(): BigInt | null {
    let value = this.get("issuedId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set issuedId(value: BigInt | null) {
    if (value === null) {
      this.unset("issuedId");
    } else {
      this.set("issuedId", Value.fromBigInt(value as BigInt));
    }
  }

  get itemType(): string {
    let value = this.get("itemType");
    return value.toString();
  }

  set itemType(value: string) {
    this.set("itemType", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get tokenURI(): string | null {
    let value = this.get("tokenURI");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tokenURI(value: string | null) {
    if (value === null) {
      this.unset("tokenURI");
    } else {
      this.set("tokenURI", Value.fromString(value as string));
    }
  }

  get image(): string | null {
    let value = this.get("image");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set image(value: string | null) {
    if (value === null) {
      this.unset("image");
    } else {
      this.set("image", Value.fromString(value as string));
    }
  }

  get urn(): string {
    let value = this.get("urn");
    return value.toString();
  }

  set urn(value: string) {
    this.set("urn", Value.fromString(value));
  }

  get orders(): Array<string> | null {
    let value = this.get("orders");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set orders(value: Array<string> | null) {
    if (value === null) {
      this.unset("orders");
    } else {
      this.set("orders", Value.fromStringArray(value as Array<string>));
    }
  }

  get bids(): Array<string> | null {
    let value = this.get("bids");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set bids(value: Array<string> | null) {
    if (value === null) {
      this.unset("bids");
    } else {
      this.set("bids", Value.fromStringArray(value as Array<string>));
    }
  }

  get activeOrder(): string | null {
    let value = this.get("activeOrder");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set activeOrder(value: string | null) {
    if (value === null) {
      this.unset("activeOrder");
    } else {
      this.set("activeOrder", Value.fromString(value as string));
    }
  }

  get collection(): string {
    let value = this.get("collection");
    return value.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get item(): string | null {
    let value = this.get("item");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set item(value: string | null) {
    if (value === null) {
      this.unset("item");
    } else {
      this.set("item", Value.fromString(value as string));
    }
  }

  get metadata(): string | null {
    let value = this.get("metadata");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set metadata(value: string | null) {
    if (value === null) {
      this.unset("metadata");
    } else {
      this.set("metadata", Value.fromString(value as string));
    }
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }

  get searchText(): string | null {
    let value = this.get("searchText");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchText(value: string | null) {
    if (value === null) {
      this.unset("searchText");
    } else {
      this.set("searchText", Value.fromString(value as string));
    }
  }

  get searchItemType(): string | null {
    let value = this.get("searchItemType");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchItemType(value: string | null) {
    if (value === null) {
      this.unset("searchItemType");
    } else {
      this.set("searchItemType", Value.fromString(value as string));
    }
  }

  get searchIsWearableHead(): boolean {
    let value = this.get("searchIsWearableHead");
    return value.toBoolean();
  }

  set searchIsWearableHead(value: boolean) {
    this.set("searchIsWearableHead", Value.fromBoolean(value));
  }

  get searchIsWearableAccessory(): boolean {
    let value = this.get("searchIsWearableAccessory");
    return value.toBoolean();
  }

  set searchIsWearableAccessory(value: boolean) {
    this.set("searchIsWearableAccessory", Value.fromBoolean(value));
  }

  get searchWearableCategory(): string | null {
    let value = this.get("searchWearableCategory");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchWearableCategory(value: string | null) {
    if (value === null) {
      this.unset("searchWearableCategory");
    } else {
      this.set("searchWearableCategory", Value.fromString(value as string));
    }
  }

  get searchWearableRarity(): string | null {
    let value = this.get("searchWearableRarity");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchWearableRarity(value: string | null) {
    if (value === null) {
      this.unset("searchWearableRarity");
    } else {
      this.set("searchWearableRarity", Value.fromString(value as string));
    }
  }

  get searchWearableBodyShapes(): Array<string> | null {
    let value = this.get("searchWearableBodyShapes");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set searchWearableBodyShapes(value: Array<string> | null) {
    if (value === null) {
      this.unset("searchWearableBodyShapes");
    } else {
      this.set(
        "searchWearableBodyShapes",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }

  get searchOrderStatus(): string | null {
    let value = this.get("searchOrderStatus");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set searchOrderStatus(value: string | null) {
    if (value === null) {
      this.unset("searchOrderStatus");
    } else {
      this.set("searchOrderStatus", Value.fromString(value as string));
    }
  }

  get searchOrderPrice(): BigInt | null {
    let value = this.get("searchOrderPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set searchOrderPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("searchOrderPrice");
    } else {
      this.set("searchOrderPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get searchOrderExpiresAt(): BigInt | null {
    let value = this.get("searchOrderExpiresAt");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set searchOrderExpiresAt(value: BigInt | null) {
    if (value === null) {
      this.unset("searchOrderExpiresAt");
    } else {
      this.set("searchOrderExpiresAt", Value.fromBigInt(value as BigInt));
    }
  }

  get searchOrderCreatedAt(): BigInt | null {
    let value = this.get("searchOrderCreatedAt");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set searchOrderCreatedAt(value: BigInt | null) {
    if (value === null) {
      this.unset("searchOrderCreatedAt");
    } else {
      this.set("searchOrderCreatedAt", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Metadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Metadata entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Metadata entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Metadata", id.toString(), this);
  }

  static load(id: string): Metadata | null {
    return store.get("Metadata", id) as Metadata | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get itemType(): string {
    let value = this.get("itemType");
    return value.toString();
  }

  set itemType(value: string) {
    this.set("itemType", Value.fromString(value));
  }

  get wearable(): string | null {
    let value = this.get("wearable");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set wearable(value: string | null) {
    if (value === null) {
      this.unset("wearable");
    } else {
      this.set("wearable", Value.fromString(value as string));
    }
  }
}

export class Wearable extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Wearable entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Wearable entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Wearable", id.toString(), this);
  }

  static load(id: string): Wearable | null {
    return store.get("Wearable", id) as Wearable | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get description(): string {
    let value = this.get("description");
    return value.toString();
  }

  set description(value: string) {
    this.set("description", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get category(): string {
    let value = this.get("category");
    return value.toString();
  }

  set category(value: string) {
    this.set("category", Value.fromString(value));
  }

  get rarity(): string {
    let value = this.get("rarity");
    return value.toString();
  }

  set rarity(value: string) {
    this.set("rarity", Value.fromString(value));
  }

  get bodyShapes(): Array<string> | null {
    let value = this.get("bodyShapes");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set bodyShapes(value: Array<string> | null) {
    if (value === null) {
      this.unset("bodyShapes");
    } else {
      this.set("bodyShapes", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Account entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Account entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Account", id.toString(), this);
  }

  static load(id: string): Account | null {
    return store.get("Account", id) as Account | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get nfts(): Array<string> | null {
    let value = this.get("nfts");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set nfts(value: Array<string> | null) {
    if (value === null) {
      this.unset("nfts");
    } else {
      this.set("nfts", Value.fromStringArray(value as Array<string>));
    }
  }

  get isCommitteeMember(): boolean {
    let value = this.get("isCommitteeMember");
    return value.toBoolean();
  }

  set isCommitteeMember(value: boolean) {
    this.set("isCommitteeMember", Value.fromBoolean(value));
  }
}

export class Order extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Order entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Order entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Order", id.toString(), this);
  }

  static load(id: string): Order | null {
    return store.get("Order", id) as Order | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nft(): string | null {
    let value = this.get("nft");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set nft(value: string | null) {
    if (value === null) {
      this.unset("nft");
    } else {
      this.set("nft", Value.fromString(value as string));
    }
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get buyer(): Bytes | null {
    let value = this.get("buyer");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set buyer(value: Bytes | null) {
    if (value === null) {
      this.unset("buyer");
    } else {
      this.set("buyer", Value.fromBytes(value as Bytes));
    }
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get status(): string {
    let value = this.get("status");
    return value.toString();
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get expiresAt(): BigInt {
    let value = this.get("expiresAt");
    return value.toBigInt();
  }

  set expiresAt(value: BigInt) {
    this.set("expiresAt", Value.fromBigInt(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }
}

export class Bid extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Bid entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Bid entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Bid", id.toString(), this);
  }

  static load(id: string): Bid | null {
    return store.get("Bid", id) as Bid | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nft(): string | null {
    let value = this.get("nft");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set nft(value: string | null) {
    if (value === null) {
      this.unset("nft");
    } else {
      this.set("nft", Value.fromString(value as string));
    }
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get blockchainId(): string {
    let value = this.get("blockchainId");
    return value.toString();
  }

  set blockchainId(value: string) {
    this.set("blockchainId", Value.fromString(value));
  }

  get bidder(): Bytes | null {
    let value = this.get("bidder");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set bidder(value: Bytes | null) {
    if (value === null) {
      this.unset("bidder");
    } else {
      this.set("bidder", Value.fromBytes(value as Bytes));
    }
  }

  get seller(): Bytes | null {
    let value = this.get("seller");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set seller(value: Bytes | null) {
    if (value === null) {
      this.unset("seller");
    } else {
      this.set("seller", Value.fromBytes(value as Bytes));
    }
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get status(): string {
    let value = this.get("status");
    return value.toString();
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get expiresAt(): BigInt {
    let value = this.get("expiresAt");
    return value.toBigInt();
  }

  set expiresAt(value: BigInt) {
    this.set("expiresAt", Value.fromBigInt(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get updatedAt(): BigInt {
    let value = this.get("updatedAt");
    return value.toBigInt();
  }

  set updatedAt(value: BigInt) {
    this.set("updatedAt", Value.fromBigInt(value));
  }
}

export class Count extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Count entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Count entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Count", id.toString(), this);
  }

  static load(id: string): Count | null {
    return store.get("Count", id) as Count | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get orderTotal(): i32 {
    let value = this.get("orderTotal");
    return value.toI32();
  }

  set orderTotal(value: i32) {
    this.set("orderTotal", Value.fromI32(value));
  }

  get collectionTotal(): i32 {
    let value = this.get("collectionTotal");
    return value.toI32();
  }

  set collectionTotal(value: i32) {
    this.set("collectionTotal", Value.fromI32(value));
  }

  get itemTotal(): i32 {
    let value = this.get("itemTotal");
    return value.toI32();
  }

  set itemTotal(value: i32) {
    this.set("itemTotal", Value.fromI32(value));
  }

  get nftTotal(): i32 {
    let value = this.get("nftTotal");
    return value.toI32();
  }

  set nftTotal(value: i32) {
    this.set("nftTotal", Value.fromI32(value));
  }

  get started(): i32 {
    let value = this.get("started");
    return value.toI32();
  }

  set started(value: i32) {
    this.set("started", Value.fromI32(value));
  }
}
