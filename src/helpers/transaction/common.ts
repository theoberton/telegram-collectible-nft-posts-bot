import { CollectionContent } from "/src/wrappers/types/index.d.ts";

import { Address } from "ton-core";

import { NftManager, NftCollection, NftItem } from "/src/wrappers/index.ts";
import { getTonClient } from "/src/utils/mod.ts";

export async function getFullNftCollectionData(collectionAddress: string) {
  const tonClient = await getTonClient();

  const nftCollection = NftCollection.createFromAddress(
    Address.parse(collectionAddress)
  );
  const nftColelctionContract = tonClient.open(nftCollection);
  const collectionData = await nftColelctionContract.getCollectionData();

  const content: CollectionContent = await fetch(
    collectionData.collectionContentUri
  ).then((res) => res.json());

  const nftManager = NftManager.createFromAddress(collectionData.ownerAddress);
  const nftManagerContract = tonClient.open(nftManager);
  const managerData = await nftManagerContract.getManagerData();

  return {
    collectionData: {
      ...collectionData,
      ownerAddress: collectionData.ownerAddress.toString(),
      address: collectionAddress,
    },
    content,
    managerAddress: String(managerData.owner.toString()),
    managerData,
  };
}

export async function getFullNftItemData(nftItemAddress: string) {
  const tonClient = await getTonClient();

  const nftItem = NftItem.createFromAddress(Address.parse(nftItemAddress));

  const nftItemContract = tonClient.open(nftItem);

  const dataofNftItem = await nftItemContract.getData();

  return dataofNftItem;
}
