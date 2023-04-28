import mongoose from "mongoose";
import { TRANSACTION_REQUEST, ITransactionRequest } from "/src/types/mod.ts";
import { TXN_CREATION_VALIDITY_MINUTES } from "/src/constants/mod.ts";

import db from "/src/db/index.ts";

const modelName = "TransactionRequest";
const collectionName = "transaction_requests";

// type TransactionRequestModelType = Model<ITransactionRequest>;

const TransactionRequestSchema = new mongoose.Schema<ITransactionRequest>({
  editionId: { type: String, required: true },
  type: {
    type: String,
    enum: [TRANSACTION_REQUEST.EDITION, TRANSACTION_REQUEST.MINT],
    required: true,
  },
  isInitiated: {
    type: Boolean,
    default: false,
  },
  notificationMessageId: {
    type: Number,
    required: false,
    default: null,
  },
  address: { type: String, required: true },
  transactionRequestId: { type: String, required: true },
  value: { type: String, required: true },
});

TransactionRequestSchema.index({ transactionRequestId: 1 }, { unique: true });
TransactionRequestSchema.index(
  { createdAt: 1 },
);

export default db.model<ITransactionRequest>(
  modelName,
  TransactionRequestSchema,
  collectionName
);
