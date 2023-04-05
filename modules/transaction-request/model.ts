import { Schema, Model } from "mongoose";
import db from "/db/index.ts";
import { ITransactionRequest } from "/types/mod.ts";

const modelName = "TransactionRequest";
const collectionName = "transaction_request";

type TransactionRequestModelType = Model<ITransactionRequest>;

const TransactionRequestSchema = new Schema<
  ITransactionRequest,
  TransactionRequestModelType
>({
  transactionRequestId: { type: String, required: true },
  value: { type: String, required: true },
});

TransactionRequestSchema.index({ transactionRequestId: 1 }, { unique: true });

export default db.model<ITransactionRequest, TransactionRequestModelType>(
  modelName,
  TransactionRequestSchema,
  collectionName
);
