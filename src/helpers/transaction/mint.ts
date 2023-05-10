import { TXN_CREATION_VALIDITY_MINUTES } from "/src/constants/mod.ts";
import { calcPercent } from "/src/utils/mod.ts";
import { Queries } from "/src/wrappers/NftManager/helpers.ts";
import { toNano, Address } from "ton-core";
import { buildNftItemStateInit } from "/src/wrappers/NftItem/helpers.ts";
import { getFullNftCollectionData } from "/src/helpers/transaction/mod.ts";

import editionService from "/src/modules/edition/service.ts";
import userService from "/src/modules/user/service.ts";

export async function composeMintTxn(collectionAddress: string) {
  const edition = await editionService.findEditionByAddress(collectionAddress);

  const data = await getFullNftCollectionData(collectionAddress);
  const nftManagerAddress = data.collectionData.ownerAddress;
  const managerAddress = nftManagerAddress.toString();

  const payload = Queries.safeMint({
    queryId: 0,
    nextItemIndex: data.collectionData.nextItemIndex,
  });

  const transactionParams = {
    messages: [
      {
        address: managerAddress,
        amount: (
          toNano(data.content.price) +
          calcPercent(toNano(data.content.price), 0.05) +
          toNano("1")
        ).toString(),
        payload: payload.toBoc().toString("base64"),
      },
    ],
  };

  const channel = await userService.findChannel({ chatId: edition.channelId });
  const returnUrl = `https://t.me/${channel.username}`;

  const transactionRequestBody = {
    type: "sign-raw-payload",
    params: transactionParams,
    response_options: {
      return_url: returnUrl,
    },
  };
  const transactionRequest = {
    version: "0",
    body: transactionRequestBody,
  };

  const { address: nftItemAddress } = buildNftItemStateInit({
    content: data.collectionData.collectionContentUri,
    collectionAddress: Address.parse(collectionAddress),
    itemIndex: data.collectionData.nextItemIndex,
  });

  return {
    transactionRequest,
    nftItemAddress,
  };
}
