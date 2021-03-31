// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AddRarity extends ethereum.Event {
  get params(): AddRarity__Params {
    return new AddRarity__Params(this);
  }
}

export class AddRarity__Params {
  _event: AddRarity;

  constructor(event: AddRarity) {
    this._event = event;
  }

  get _rarity(): AddRarity_rarityStruct {
    return this._event.parameters[0].value.toTuple() as AddRarity_rarityStruct;
  }
}

export class AddRarity_rarityStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get maxSupply(): BigInt {
    return this[1].toBigInt();
  }

  get price(): BigInt {
    return this[2].toBigInt();
  }
}

export class MetaTransactionExecuted extends ethereum.Event {
  get params(): MetaTransactionExecuted__Params {
    return new MetaTransactionExecuted__Params(this);
  }
}

export class MetaTransactionExecuted__Params {
  _event: MetaTransactionExecuted;

  constructor(event: MetaTransactionExecuted) {
    this._event = event;
  }

  get userAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get relayerAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get functionSignature(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class UpdatePrice extends ethereum.Event {
  get params(): UpdatePrice__Params {
    return new UpdatePrice__Params(this);
  }
}

export class UpdatePrice__Params {
  _event: UpdatePrice;

  constructor(event: UpdatePrice) {
    this._event = event;
  }

  get _name(): string {
    return this._event.parameters[0].value.toString();
  }

  get _price(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Rarity__getRarityByNameResultValue0Struct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get maxSupply(): BigInt {
    return this[1].toBigInt();
  }

  get price(): BigInt {
    return this[2].toBigInt();
  }
}

export class Rarity__raritiesResult {
  value0: string;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: string, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromString(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }
}

export class Rarity extends ethereum.SmartContract {
  static bind(address: Address): Rarity {
    return new Rarity("Rarity", address);
  }

  domainSeparator(): Bytes {
    let result = super.call(
      "domainSeparator",
      "domainSeparator():(bytes32)",
      []
    );

    return result[0].toBytes();
  }

  try_domainSeparator(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "domainSeparator",
      "domainSeparator():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getChainId(): BigInt {
    let result = super.call("getChainId", "getChainId():(uint256)", []);

    return result[0].toBigInt();
  }

  try_getChainId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getChainId", "getChainId():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getNonce(user: Address): BigInt {
    let result = super.call("getNonce", "getNonce(address):(uint256)", [
      ethereum.Value.fromAddress(user)
    ]);

    return result[0].toBigInt();
  }

  try_getNonce(user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("getNonce", "getNonce(address):(uint256)", [
      ethereum.Value.fromAddress(user)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRarityByName(_rarity: string): Rarity__getRarityByNameResultValue0Struct {
    let result = super.call(
      "getRarityByName",
      "getRarityByName(string):((string,uint256,uint256))",
      [ethereum.Value.fromString(_rarity)]
    );

    return result[0].toTuple() as Rarity__getRarityByNameResultValue0Struct;
  }

  try_getRarityByName(
    _rarity: string
  ): ethereum.CallResult<Rarity__getRarityByNameResultValue0Struct> {
    let result = super.tryCall(
      "getRarityByName",
      "getRarityByName(string):((string,uint256,uint256))",
      [ethereum.Value.fromString(_rarity)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTuple() as Rarity__getRarityByNameResultValue0Struct
    );
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  rarities(param0: BigInt): Rarity__raritiesResult {
    let result = super.call(
      "rarities",
      "rarities(uint256):(string,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new Rarity__raritiesResult(
      result[0].toString(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_rarities(param0: BigInt): ethereum.CallResult<Rarity__raritiesResult> {
    let result = super.tryCall(
      "rarities",
      "rarities(uint256):(string,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Rarity__raritiesResult(
        value[0].toString(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  raritiesCount(): BigInt {
    let result = super.call("raritiesCount", "raritiesCount():(uint256)", []);

    return result[0].toBigInt();
  }

  try_raritiesCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "raritiesCount",
      "raritiesCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _rarities(): Array<ConstructorCall_raritiesStruct> {
    return this._call.inputValues[1].value.toTupleArray<
      ConstructorCall_raritiesStruct
    >();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall_raritiesStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get maxSupply(): BigInt {
    return this[1].toBigInt();
  }

  get price(): BigInt {
    return this[2].toBigInt();
  }
}

export class AddRaritiesCall extends ethereum.Call {
  get inputs(): AddRaritiesCall__Inputs {
    return new AddRaritiesCall__Inputs(this);
  }

  get outputs(): AddRaritiesCall__Outputs {
    return new AddRaritiesCall__Outputs(this);
  }
}

export class AddRaritiesCall__Inputs {
  _call: AddRaritiesCall;

  constructor(call: AddRaritiesCall) {
    this._call = call;
  }

  get _rarities(): Array<AddRaritiesCall_raritiesStruct> {
    return this._call.inputValues[0].value.toTupleArray<
      AddRaritiesCall_raritiesStruct
    >();
  }
}

export class AddRaritiesCall__Outputs {
  _call: AddRaritiesCall;

  constructor(call: AddRaritiesCall) {
    this._call = call;
  }
}

export class AddRaritiesCall_raritiesStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get maxSupply(): BigInt {
    return this[1].toBigInt();
  }

  get price(): BigInt {
    return this[2].toBigInt();
  }
}

export class ExecuteMetaTransactionCall extends ethereum.Call {
  get inputs(): ExecuteMetaTransactionCall__Inputs {
    return new ExecuteMetaTransactionCall__Inputs(this);
  }

  get outputs(): ExecuteMetaTransactionCall__Outputs {
    return new ExecuteMetaTransactionCall__Outputs(this);
  }
}

export class ExecuteMetaTransactionCall__Inputs {
  _call: ExecuteMetaTransactionCall;

  constructor(call: ExecuteMetaTransactionCall) {
    this._call = call;
  }

  get userAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get functionSignature(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get sigR(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get sigS(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get sigV(): i32 {
    return this._call.inputValues[4].value.toI32();
  }
}

export class ExecuteMetaTransactionCall__Outputs {
  _call: ExecuteMetaTransactionCall;

  constructor(call: ExecuteMetaTransactionCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdatePricesCall extends ethereum.Call {
  get inputs(): UpdatePricesCall__Inputs {
    return new UpdatePricesCall__Inputs(this);
  }

  get outputs(): UpdatePricesCall__Outputs {
    return new UpdatePricesCall__Outputs(this);
  }
}

export class UpdatePricesCall__Inputs {
  _call: UpdatePricesCall;

  constructor(call: UpdatePricesCall) {
    this._call = call;
  }

  get _names(): Array<string> {
    return this._call.inputValues[0].value.toStringArray();
  }

  get _prices(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class UpdatePricesCall__Outputs {
  _call: UpdatePricesCall;

  constructor(call: UpdatePricesCall) {
    this._call = call;
  }
}
