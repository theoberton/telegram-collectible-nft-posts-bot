import { Job } from "agenda";
import bot from "/src/bot/mod.ts";
import scheduler from "/src/db/scheduler.ts";
import { composeMintTitle } from "/src/utils/mod.ts";
import { logger } from "/src/utils/mod.ts";

import { getFullNftItemData } from "/src/helpers/transaction/mod.ts";
import { NFTItemTransactionData } from "/src/types/mod.ts";
import { composeMintLink } from "/src/modules/edition/helpers.ts";
import transactionRequestService from "/src/modules/transaction-request/service.ts";
import editionService from "/src/modules/edition/service.ts";
import { updatePostButton } from "/src/helpers/mod.ts";

export async function mintDiscoveryJob(job: Job<NFTItemTransactionData>) {
  const { address, transactionRequestId } = job.attrs.data;
  logger.info("Mint one", transactionRequestId);
  const transactionRequest =
    await transactionRequestService.getTransactionRequest(transactionRequestId);

  try {
    let blchnData;
    try {
      blchnData = await getFullNftItemData(address);
    } catch (_error) {
      /*
       * Expect error untill transaction appears in blockchain
       */

      return;
    }

    const mintLink = await composeMintLink(transactionRequest.edition.address);
    logger.info("Mint two", transactionRequestId);

    await editionService.updateEdition(
      {
        _id: transactionRequest.editionId,
      },
      {
        mintLink,
        isPublished: true,
      }
    );

    await updatePostButton(bot, {
      channelId: transactionRequest.edition.channelId,
      messageId: transactionRequest.edition.messageId,
      title: composeMintTitle(transactionRequest.edition, blchnData.index + 1),
      link: mintLink,
    });

    await scheduler.cancel({
      name: job.attrs.name,
    });
  } catch (error) {
    logger.error("***********************");
    logger.error(`Mint discovery error`);
    logger.error(error);
    logger.error("***********************");
  }
}
