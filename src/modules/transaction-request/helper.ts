import scheduler from "/src/db/scheduler.ts";
import { addMinutes } from "date-fns";

import { composeTransactionJobTitle } from "/src/utils/mod.ts";
import {
  TXN_CREATION_VALIDITY_MINUTES,
  DEFAULT_TXN_DISCOVERY_INTERVAL,
} from "/src/constants/mod.ts";

import {
  ITransactionRequest,
  NFTEditionTransactionData,
  NFTItemTransactionData,
  TRANSACTION_REQUEST,
} from "/src/types/mod.ts";

import { editionDiscoveryJob, mintDiscoveryJob } from "/src/jobs/mod.ts";

export const runEditionExplorer = async (
  transactionRequest: ITransactionRequest
) => {
  const jobName = composeTransactionJobTitle(
    transactionRequest.transactionRequestId,
    TRANSACTION_REQUEST.EDITION
  );

  const [existingJob] = await scheduler.jobs({
    name: jobName,
  });

  if (existingJob) {
    return;
  }

  scheduler.define<NFTEditionTransactionData>(jobName, editionDiscoveryJob);

  const jobSettings = {
    address: transactionRequest.address,
    transactionRequestId: transactionRequest.transactionRequestId,
  };

  const txnRequestJob = scheduler.create<NFTEditionTransactionData>(
    jobName,
    jobSettings
  );

  const endDate = addMinutes(new Date(), TXN_CREATION_VALIDITY_MINUTES);

  await txnRequestJob
    .repeatEvery(DEFAULT_TXN_DISCOVERY_INTERVAL, { endDate })
    .save();
};

export const runMintExplorer = async (
  transactionRequest: ITransactionRequest
) => {
  const jobName = composeTransactionJobTitle(
    transactionRequest.transactionRequestId,
    TRANSACTION_REQUEST.MINT
  );

  const [existingJob] = await scheduler.jobs({
    name: jobName,
  });

  if (existingJob) {
    return;
  }

  scheduler.define<NFTItemTransactionData>(jobName, mintDiscoveryJob);

  const job = scheduler.create(jobName, {
    address: transactionRequest.address,
    transactionRequestId: transactionRequest.transactionRequestId,
  });

  const endDate = addMinutes(new Date(), TXN_CREATION_VALIDITY_MINUTES);

  await job.repeatEvery(DEFAULT_TXN_DISCOVERY_INTERVAL, { endDate }).save();
};
