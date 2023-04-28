import bot from "/src/bot/mod.ts";
import { Job } from "agenda";
import { DEFAULT_MESSAGE_OPTIONS } from "/src/constants/mod.ts";
import { logger } from "/src/utils/mod.ts";

import scheduler from "/src/db/scheduler.ts";
import { EDITION_DEFAULT_SETTINGS_REPLIES_MAP } from "/src/bot/replies.ts";
import postService from "/src/modules/post/service.ts";

import { updatePostButton } from "/src/helpers/mod.ts";

import editionService from "/src/modules/edition/service.ts";
import { getFullNftCollectionData } from "/src/helpers/transaction/mod.ts";

import { NFTEditionTransactionData } from "/src/types/mod.ts";
import { composeMintLink } from "/src/modules/edition/helpers.ts";
import transactionRequestService from "/src/modules/transaction-request/service.ts";

export async function editionDiscoveryJob(job: Job<NFTEditionTransactionData>) {
  const { address, transactionRequestId } = job.attrs.data;

  logger.info("Starting TransactionId", transactionRequestId);
  const transactionRequest =
    await transactionRequestService.getTransactionRequest(transactionRequestId);
  logger.info("Transaction initiation status", transactionRequest.isInitiated);
  logger.info("One", transactionRequestId);

  if (!transactionRequest.isInitiated) {
    await transactionRequestService.updateTransactionRequest(
      {
        transactionRequestId: transactionRequest.transactionRequestId,
      },
      { isInitiated: true }
    );
  }
  logger.info("Two", transactionRequestId);

  try {
    let blckhnData;

    try {
      blckhnData = await getFullNftCollectionData(address);
    } catch (_error) {
      console.log('_error', _error)
      logger.info("Three", transactionRequestId);

      /*
       * Expect error untill transaction appears in blockchain
       */

      return;
    }
    logger.info("Four", transactionRequestId);

    await editionService.updateEdition(
      {
        _id: transactionRequest.editionId,
      },
      {
        isPublished: true,
        address: blckhnData.collectionData.address,
      }
    );

    const [mintLink, post] = await Promise.all([
      composeMintLink(address),
      postService.getPost(
        Number(transactionRequest.edition.messageId),
        Number(transactionRequest.edition.channelId)
      ),
    ]);
    logger.info("Five", transactionRequestId);

    try {
      await Promise.all([
        bot.api.deleteMessage(
          transactionRequest.edition.userId,
          transactionRequest.notificationMessageId!
        ),
      ]);
    } catch (_error) {
      logger.error("Ignoring failed to delete previous message");
    }
    logger.info("Six", transactionRequestId);

    await Promise.all([
      updatePostButton(bot, {
        channelId: transactionRequest.edition.channelId,
        messageId: transactionRequest.edition.messageId,
        title: transactionRequest.edition.title,
        link: mintLink,
      }),
      editionService.updateEdition(
        {
          _id: transactionRequest.editionId,
        },
        {
          mintLink,
        }
      ),
      bot.api.sendMessage(
        transactionRequest.edition.userId,
        EDITION_DEFAULT_SETTINGS_REPLIES_MAP.POST_EDITION_HAS_BEEN_CREATED(
          post,
          post.channel
        ),
        DEFAULT_MESSAGE_OPTIONS
      ),
    ]);

    await scheduler.cancel({ name: job.attrs.name });
  } catch (error) {
    logger.error("***********************");
    logger.error(`Edition discovery error`);
    logger.error(error);
    logger.error("***********************");
  }

  logger.info("Six", transactionRequestId);
}
