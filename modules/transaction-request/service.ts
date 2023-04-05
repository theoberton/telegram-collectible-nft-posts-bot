import TransactionRequest from '@/modules/transaction-request/model';
import { ITransactionRequest } from '@/types';

function createTransactionRequest(data: ITransactionRequest) {
	const transactionRequest = new TransactionRequest(data);

	return transactionRequest.save();
}

async function getTransactionRequest(transactionRequestId: string) {
	const transactionRequest = await TransactionRequest.findOne({
		transactionRequestId,
	});

	return transactionRequest;
}

export default {
	createTransactionRequest,
	getTransactionRequest,
};
