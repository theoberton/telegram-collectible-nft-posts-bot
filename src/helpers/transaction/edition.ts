import { TXN_CREATION_VALIDITY_MINUTES } from "/src/constants/mod.ts";
import { NftManager, NftCollection } from "/src/wrappers/index.ts";
import { DEFAULT_EDITION_SYMBOL } from "/src/constants/mod.ts";

import config from "config";

import { Queries } from "/src/wrappers/NftManager/helpers.ts";
import {
  CollectionContent,
  NftCollectionDataOptional,
} from "/src/wrappers/types/index.d.ts";
import { Address, toNano } from "ton-core";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { getTonClient } from "/src/utils/mod.ts";
import { logger } from "/src/utils/mod.ts";

export async function composeEditionTxn(
  managerParams: any,
  transactionRequestId: string
) {
  logger.info("before compose edition txn")

  const tonClient = await getTonClient();

  const content: CollectionContent = {
    name: managerParams.name,
    description: managerParams.description,
    image: managerParams.image,
    royalty: String(managerParams.royalty),
    price: String(managerParams.price),
    maxSupply: managerParams.maxSupply,
    dateStart: managerParams.dateStart,
    dateEnd: managerParams.dateEnd,
    symbol: DEFAULT_EDITION_SYMBOL,
    payoutAddress: managerParams.payoutAddress,
    feeRecipient: managerParams.payoutAddress,
  };

  const storage = new ThirdwebStorage();

  const collectionContentUri = await storage.upload(content, {
    uploadWithGatewayUrl: true,
  });

  logger.info("After upload on transation")

  const collectionContentUrl = storage.resolveScheme(collectionContentUri);

  const managerInitData = {
    content: collectionContentUrl,
    mintPrice: toNano(managerParams.price),
    maxSupply: BigInt(managerParams.maxSupply),
    mintDateStart: BigInt(managerParams.dateStart),
    mintDateEnd: BigInt(managerParams.dateEnd),
    payoutAddress: Address.parse(managerParams.payoutAddress),
  };

  const nftManager = NftManager.createFromConfig(managerInitData);
  const nftManagerContract = tonClient.open(nftManager);

  const nftCollectionInitData: NftCollectionDataOptional = {
    ownerAddress: nftManagerContract.address,
    collectionContentUri: collectionContentUrl,
    commonContent: collectionContentUrl,
    royaltyParams: {
      royaltyBase: 100,
      royaltyFactor: Number(managerParams.royalty),
      royaltyAddress: Address.parse(managerParams.payoutAddress),
    },
  };

  const nftCollection = NftCollection.createFromConfig(nftCollectionInitData);
  const nftCollectionContract = tonClient.open(nftCollection);
  const nftCollectionAddress = nftCollectionContract.address.toString();
  const nftCollectionStateInit =
    nftCollectionContract.createStateInitAsBase64();

  const nftManagerStateInit = nftManagerContract.createStateInitAsBase64();
  const nftManagerAddress = nftManagerContract.address.toString();
  const nftManagerPayload = Queries.setNftCollectionAddress(
    nftCollectionContract.address
  );

  const transactionParams = {
    validUntil: Date.now() + 1000 * 60 * TXN_CREATION_VALIDITY_MINUTES,
    messages: [
      {
        address: nftCollectionAddress,
        amount: toNano("0.05").toString(),
        stateInit: nftCollectionStateInit,
      },
      {
        address: nftManagerAddress,
        amount: toNano("0.05").toString(),
        payload: nftManagerPayload.toBoc().toString("base64"),
        stateInit: nftManagerStateInit,
      },
    ],
  };

  const hostUrl = config.get("host.url") as string;

  const fullReturnUrl = `https://${hostUrl}/transaction-request/${transactionRequestId}/completed`;

  const transactionRequestBody = {
    type: "sign-raw-payload",
    params: transactionParams,
    response_options: {
      return_url: fullReturnUrl,
    },
  };
  const transactionRequest = {
    version: "0",
    body: transactionRequestBody,
  };

  return {
    transactionRequest,
    nftCollectionAddress,
    nftManagerAddress,
  };
}
