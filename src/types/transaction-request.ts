import { TRANSACTION_REQUEST, IEdition } from "/src/types/mod.ts";

export interface ITransactionRequest {
  editionId: string;
  notificationMessageId?: number;
  address: string;
  isInitiated?: boolean;
  isPublished?: boolean;
  type: TRANSACTION_REQUEST;
  transactionRequestId: string;
  value: string;
}

export enum TransactionTypes {
  MINT = "mint",
  EDITION = "edition",
}

export interface ITransactionRequestFull extends ITransactionRequest {
  edition: IEdition;
}

export type NFTEditionTransactionData = {
  address: string;
  transactionRequestId: string;
};

export type NFTItemTransactionData = {
  editionId: string;
  address: string;
  transactionRequestId: string;
  isInitiated: boolean;
};

export type JobData = NFTEditionTransactionData | NFTItemTransactionData;

export type TransactionRequestQuery = {
  transactionRequestId: string;
};
