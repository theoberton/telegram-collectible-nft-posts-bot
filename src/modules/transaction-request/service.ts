import TransactionRequest from "/src/modules/transaction-request/model.ts";
import {
  ITransactionRequest,
  ITransactionRequestFull,
  TransactionRequestQuery,
} from "/src/types/mod.ts";
import {
  composeEditionLatestTransactionRequestPipeline,
  composeGetTransactionRequestPipeline,
} from "/src/modules/transaction-request/query.builder.ts";

function createTransactionRequest(data: ITransactionRequest) {
  const transactionRequest = new TransactionRequest(data);

  return transactionRequest.save();
}

async function getTransactionRequest(
  transactionRequestId: string
): Promise<ITransactionRequestFull> {
  const pipeline = composeGetTransactionRequestPipeline(transactionRequestId);
  const [transactionRequest = null] = await TransactionRequest.aggregate(
    pipeline
  );

  return transactionRequest;
}

async function updateTransactionRequest(
  query: TransactionRequestQuery,
  data: Partial<ITransactionRequest>
) {
  const transactionRequest = await TransactionRequest.updateOne(query, {
    $set: data,
  });

  return transactionRequest;
}

async function getEditionLatestTransactionRequest(
  query: Partial<ITransactionRequest>
): Promise<ITransactionRequest> {
  const pipeline = composeEditionLatestTransactionRequestPipeline(query);
  const [transactionRequest = null] = await TransactionRequest.aggregate(
    pipeline
  );

  return transactionRequest;
}

export default {
  createTransactionRequest,
  getTransactionRequest,
  updateTransactionRequest,
  getEditionLatestTransactionRequest,
};
