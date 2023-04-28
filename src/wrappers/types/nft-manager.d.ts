import { Address } from "ton-core";
import { CollectionContent } from "./nft-collection.d.ts";

export type NftManagerInitData = {
  owner?: Address;
  payoutAddress: Address;
  mintPrice: bigint;
  maxSupply: bigint;
  mintDateStart: bigint;
  mintDateEnd: bigint;
  content: string;
};

export type ManagerFullData = {
  collectionData: EditionData;
  content: CollectionContent;
  managerAddress: string;
  managerData: NftManagerData;
};

export type EditionData = {
  ownerAddress: string;
  address: string;
  nextItemIndex: number;
  collectionContentUri: string;
};

export type SetNftCollectionAddress = {
  $$type: "SetNftCollectionAddress";
  nftCollectionAddress: Address;
};

export type ChangeOwnerOfCollection = {
  $$type: "ChangeOwnerOfCollection";
  newOwner: Address;
};

export type ChangeOwnerOfCollectionParams = {
  newOwner: Address;
};

export type SendMintParams = {
  queryId?: number;
  nextItemIndex: number;
  itemOwner?: Address;
};

export type EditDataParams = {
  queryId?: number;
  content: string;
  mintPrice: bigint;
  mintDateStart: bigint;
  mintDateEnd: bigint;
  commonContent: string;
  payoutAddress: Address;
};

export type NftManagerData = {
  owner: Address;
  nftCollectionAddress: Address;
  mintPrice: bigint;
  maxSupply: number;
  mintDateStart: number;
  mintDateEnd: number;
  payoutAddress: Address;
};

export type MintSafe = {
  $$type: "MintSafe";
  queryId: int;
  nextItemIndex: int;
  itemOwner: Address;
};

export type EditData = {
  $$type: "EditData";
  queryId: bigint;
  content: string;
  commonContent: string;
  mintPrice: bigint;
  mintDateStart: bigint;
  mintDateEnd: bigint;
  payoutAddress: Address;
};
