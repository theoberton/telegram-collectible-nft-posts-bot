import { TRANSACTION_REQUEST } from "/src/types/mod.ts";

export function composeTransactionJobTitle(
  id: string,
  type: TRANSACTION_REQUEST
) {
  return `txnrequest:${type}:${id}`;
}
