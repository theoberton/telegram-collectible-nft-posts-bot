import { TRANSACTION_REQUEST, EditionData } from "/src/types/mod.ts";
import { DEFAULT_EDITION_SYMBOL } from "/src/constants/mod.ts";

import { getEditionTitleName, logger, uuidv4 } from "/src/utils/mod.ts";
import config from "config";

import editionService from "/src/modules/edition/service.ts";
import transactionRequestService from "/src/modules/transaction-request/service.ts";
import postService from "/src/modules/post/service.ts";
import userService from "/src/modules/user/service.ts";

import { getPostScreenshot } from "/src/helpers/mod.ts";
import {
  composeEditionTxn,
  composeMintTxn,
} from "/src/helpers/transaction/mod.ts";

export async function composePostEditionLink(editionData: EditionData) {
  let edition = await editionService.findEdition(editionData);

  if (!edition) {
    edition = await editionService.createEdition(editionData);
  }

  const [channel, user] = await Promise.all([
    userService.findChannel({ chatId: editionData.channelId }),
    userService.findUserByChannelId(editionData.channelId),
  ]);

  const editionId = edition.id;
  const postId = editionData.postId;

  const link = `https://t.me/${channel.username}/${postId}`;

  const [screenshotLink, post] = await Promise.all([
    getPostScreenshot(link),
    postService.getPost(postId, channel.chatId),
  ]);

  const editionParams = {
    name: getEditionTitleName(post.text || "TG post"),
    link,
    description: link,
    image: screenshotLink,
    symbol: DEFAULT_EDITION_SYMBOL,
    dateStart: 0,
    dateEnd: 0,
    royalty: String(user.editionSettings.royalty),
    price: String(user.editionSettings.price),
    maxSupply: 0,
    payoutAddress: user.editionSettings.payoutAddress,
  };

  const transactionRequestId = uuidv4();

  logger.info("before compose edition txn")
  const { transactionRequest, nftCollectionAddress } = await composeEditionTxn(
    editionParams,
    transactionRequestId
  );
  logger.info("after compose edition txn")

  await transactionRequestService.createTransactionRequest({
    editionId,
    address: nftCollectionAddress,
    transactionRequestId,
    type: TRANSACTION_REQUEST.EDITION,
    value: JSON.stringify(transactionRequest),
  });

  const hostUrl = config.get("host.url") as string;
  const tonkeeperUrl = config.get("tonkeeper.url") as string;

  const transactionLink = `${hostUrl}/transaction-request/${transactionRequestId}`;
  const finalLink = `${tonkeeperUrl}/txrequest-url/${transactionLink}`;

  return finalLink;
}

export async function composeMintLink(collectionAddress: string) {
  const { transactionRequest, nftItemAddress } = await composeMintTxn(
    collectionAddress
  );

  const edition = await editionService.findEditionByAddress(collectionAddress);

  const transactionRequestId = crypto.randomUUID();

  await transactionRequestService.createTransactionRequest({
    editionId: edition.id,
    address: nftItemAddress.toString(),
    transactionRequestId,
    type: TRANSACTION_REQUEST.MINT,
    value: JSON.stringify(transactionRequest),
  });

  const hostUrl = config.get("host.url") as string;
  const tonkeeperUrl = config.get("tonkeeper.url") as string;

  const transactionLink = `${hostUrl}/transaction-request/${transactionRequestId}`;
  const finalLink = `${tonkeeperUrl}/txrequest-url/${transactionLink}`;

  return finalLink;
}
