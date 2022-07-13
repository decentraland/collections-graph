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

export class AcceptedTokenSet extends ethereum.Event {
  get params(): AcceptedTokenSet__Params {
    return new AcceptedTokenSet__Params(this);
  }
}

export class AcceptedTokenSet__Params {
  _event: AcceptedTokenSet;

  constructor(event: AcceptedTokenSet) {
    this._event = event;
  }

  get _oldAcceptedToken(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _newAcceptedToken(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class CommitteeMethodSet extends ethereum.Event {
  get params(): CommitteeMethodSet__Params {
    return new CommitteeMethodSet__Params(this);
  }
}

export class CommitteeMethodSet__Params {
  _event: CommitteeMethodSet;

  constructor(event: CommitteeMethodSet) {
    this._event = event;
  }

  get _method(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get _isAllowed(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class CommitteeSet extends ethereum.Event {
  get params(): CommitteeSet__Params {
    return new CommitteeSet__Params(this);
  }
}

export class CommitteeSet__Params {
  _event: CommitteeSet;

  constructor(event: CommitteeSet) {
    this._event = event;
  }

  get _oldCommittee(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _newCommittee(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class FeesCollectorSet extends ethereum.Event {
  get params(): FeesCollectorSet__Params {
    return new FeesCollectorSet__Params(this);
  }
}

export class FeesCollectorSet__Params {
  _event: FeesCollectorSet;

  constructor(event: FeesCollectorSet) {
    this._event = event;
  }

  get _oldFeesCollector(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _newFeesCollector(): Address {
    return this._event.parameters[1].value.toAddress();
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

export class RaritiesSet extends ethereum.Event {
  get params(): RaritiesSet__Params {
    return new RaritiesSet__Params(this);
  }
}

export class RaritiesSet__Params {
  _event: RaritiesSet;

  constructor(event: RaritiesSet) {
    this._event = event;
  }

  get _oldRarities(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _newRarities(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class CollectionManager extends ethereum.SmartContract {
  static bind(address: Address): CollectionManager {
    return new CollectionManager("CollectionManager", address);
  }

  acceptedToken(): Address {
    let result = super.call("acceptedToken", "acceptedToken():(address)", []);

    return result[0].toAddress();
  }

  try_acceptedToken(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "acceptedToken",
      "acceptedToken():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  allowedCommitteeMethods(param0: Bytes): boolean {
    let result = super.call(
      "allowedCommitteeMethods",
      "allowedCommitteeMethods(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );

    return result[0].toBoolean();
  }

  try_allowedCommitteeMethods(param0: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "allowedCommitteeMethods",
      "allowedCommitteeMethods(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  committee(): Address {
    let result = super.call("committee", "committee():(address)", []);

    return result[0].toAddress();
  }

  try_committee(): ethereum.CallResult<Address> {
    let result = super.tryCall("committee", "committee():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  feesCollector(): Address {
    let result = super.call("feesCollector", "feesCollector():(address)", []);

    return result[0].toAddress();
  }

  try_feesCollector(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "feesCollector",
      "feesCollector():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  pricePerItem(): BigInt {
    let result = super.call("pricePerItem", "pricePerItem():(uint256)", []);

    return result[0].toBigInt();
  }

  try_pricePerItem(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("pricePerItem", "pricePerItem():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  rarities(): Address {
    let result = super.call("rarities", "rarities():(address)", []);

    return result[0].toAddress();
  }

  try_rarities(): ethereum.CallResult<Address> {
    let result = super.tryCall("rarities", "rarities():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  get _acceptedToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _committee(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _feesCollector(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _rarities(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get _committeeMethods(): Array<Bytes> {
    return this._call.inputValues[5].value.toBytesArray();
  }

  get _committeeValues(): Array<boolean> {
    return this._call.inputValues[6].value.toBooleanArray();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCollectionCall extends ethereum.Call {
  get inputs(): CreateCollectionCall__Inputs {
    return new CreateCollectionCall__Inputs(this);
  }

  get outputs(): CreateCollectionCall__Outputs {
    return new CreateCollectionCall__Outputs(this);
  }
}

export class CreateCollectionCall__Inputs {
  _call: CreateCollectionCall;

  constructor(call: CreateCollectionCall) {
    this._call = call;
  }

  get _forwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _factory(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _salt(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get _name(): string {
    return this._call.inputValues[3].value.toString();
  }

  get _symbol(): string {
    return this._call.inputValues[4].value.toString();
  }

  get _baseURI(): string {
    return this._call.inputValues[5].value.toString();
  }

  get _creator(): Address {
    return this._call.inputValues[6].value.toAddress();
  }

  get _items(): Array<CreateCollectionCall_itemsStruct> {
    return this._call.inputValues[7].value.toTupleArray<
      CreateCollectionCall_itemsStruct
    >();
  }
}

export class CreateCollectionCall__Outputs {
  _call: CreateCollectionCall;

  constructor(call: CreateCollectionCall) {
    this._call = call;
  }
}

export class CreateCollectionCall_itemsStruct extends ethereum.Tuple {
  get rarity(): string {
    return this[0].toString();
  }

  get price(): BigInt {
    return this[1].toBigInt();
  }

  get beneficiary(): Address {
    return this[2].toAddress();
  }

  get metadata(): string {
    return this[3].toString();
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

export class ManageCollectionCall extends ethereum.Call {
  get inputs(): ManageCollectionCall__Inputs {
    return new ManageCollectionCall__Inputs(this);
  }

  get outputs(): ManageCollectionCall__Outputs {
    return new ManageCollectionCall__Outputs(this);
  }
}

export class ManageCollectionCall__Inputs {
  _call: ManageCollectionCall;

  constructor(call: ManageCollectionCall) {
    this._call = call;
  }

  get _forwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _collection(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class ManageCollectionCall__Outputs {
  _call: ManageCollectionCall;

  constructor(call: ManageCollectionCall) {
    this._call = call;
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

export class SetAcceptedTokenCall extends ethereum.Call {
  get inputs(): SetAcceptedTokenCall__Inputs {
    return new SetAcceptedTokenCall__Inputs(this);
  }

  get outputs(): SetAcceptedTokenCall__Outputs {
    return new SetAcceptedTokenCall__Outputs(this);
  }
}

export class SetAcceptedTokenCall__Inputs {
  _call: SetAcceptedTokenCall;

  constructor(call: SetAcceptedTokenCall) {
    this._call = call;
  }

  get _newAcceptedToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAcceptedTokenCall__Outputs {
  _call: SetAcceptedTokenCall;

  constructor(call: SetAcceptedTokenCall) {
    this._call = call;
  }
}

export class SetCommitteeCall extends ethereum.Call {
  get inputs(): SetCommitteeCall__Inputs {
    return new SetCommitteeCall__Inputs(this);
  }

  get outputs(): SetCommitteeCall__Outputs {
    return new SetCommitteeCall__Outputs(this);
  }
}

export class SetCommitteeCall__Inputs {
  _call: SetCommitteeCall;

  constructor(call: SetCommitteeCall) {
    this._call = call;
  }

  get _newCommittee(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetCommitteeCall__Outputs {
  _call: SetCommitteeCall;

  constructor(call: SetCommitteeCall) {
    this._call = call;
  }
}

export class SetCommitteeMethodsCall extends ethereum.Call {
  get inputs(): SetCommitteeMethodsCall__Inputs {
    return new SetCommitteeMethodsCall__Inputs(this);
  }

  get outputs(): SetCommitteeMethodsCall__Outputs {
    return new SetCommitteeMethodsCall__Outputs(this);
  }
}

export class SetCommitteeMethodsCall__Inputs {
  _call: SetCommitteeMethodsCall;

  constructor(call: SetCommitteeMethodsCall) {
    this._call = call;
  }

  get _methods(): Array<Bytes> {
    return this._call.inputValues[0].value.toBytesArray();
  }

  get _values(): Array<boolean> {
    return this._call.inputValues[1].value.toBooleanArray();
  }
}

export class SetCommitteeMethodsCall__Outputs {
  _call: SetCommitteeMethodsCall;

  constructor(call: SetCommitteeMethodsCall) {
    this._call = call;
  }
}

export class SetFeesCollectorCall extends ethereum.Call {
  get inputs(): SetFeesCollectorCall__Inputs {
    return new SetFeesCollectorCall__Inputs(this);
  }

  get outputs(): SetFeesCollectorCall__Outputs {
    return new SetFeesCollectorCall__Outputs(this);
  }
}

export class SetFeesCollectorCall__Inputs {
  _call: SetFeesCollectorCall;

  constructor(call: SetFeesCollectorCall) {
    this._call = call;
  }

  get _newFeesCollector(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetFeesCollectorCall__Outputs {
  _call: SetFeesCollectorCall;

  constructor(call: SetFeesCollectorCall) {
    this._call = call;
  }
}

export class SetRaritiesCall extends ethereum.Call {
  get inputs(): SetRaritiesCall__Inputs {
    return new SetRaritiesCall__Inputs(this);
  }

  get outputs(): SetRaritiesCall__Outputs {
    return new SetRaritiesCall__Outputs(this);
  }
}

export class SetRaritiesCall__Inputs {
  _call: SetRaritiesCall;

  constructor(call: SetRaritiesCall) {
    this._call = call;
  }

  get _newRarities(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetRaritiesCall__Outputs {
  _call: SetRaritiesCall;

  constructor(call: SetRaritiesCall) {
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
