import bot from "/src/bot/mod.ts";
import transactionRequestService from "/src/modules/transaction-request/service.ts";
import { MY_POSTS_REPLIES_MAP } from "/src/bot/replies.ts";


import { TRANSACTION_REQUEST } from "/src/types/mod.ts";
import {
  runEditionExplorer,
  runMintExplorer,
} from "/src/modules/transaction-request/helper.ts";

const transactionExplorersMap = {
  [TRANSACTION_REQUEST.EDITION]: runEditionExplorer,
  [TRANSACTION_REQUEST.MINT]: runMintExplorer,
};

async function handleTransactionRequest(transactionRequestId: string) {
  const transactionRequest =
    await transactionRequestService.getTransactionRequest(transactionRequestId);

  if (!transactionRequest) {
    return transactionRequest;
  }

  const setupTransactionExplorer =
    transactionExplorersMap[transactionRequest.type];

  await setupTransactionExplorer(transactionRequest);

  return transactionRequest.value;
}

async function handleTransactionRequestCompletion(
  transactionRequestId: string
) {
  const transactionRequest =
    await transactionRequestService.getTransactionRequest(transactionRequestId);

  const message = await bot.api.sendMessage(
    transactionRequest.edition.userId,
    MY_POSTS_REPLIES_MAP.WAITING_FOR_TXN_TO_APPEAR_IN_BLCH
  );

  await transactionRequestService.updateTransactionRequest(
    { transactionRequestId },
    {
      notificationMessageId: message.message_id,
    }
  );
}

async function getTransacationRequest(transactionRequestId: string) {
  const transactionRequest =
    await transactionRequestService.getTransactionRequest(transactionRequestId);

  return transactionRequest;
}

export default {
  handleTransactionRequest,
  getTransacationRequest,
  handleTransactionRequestCompletion,
};
