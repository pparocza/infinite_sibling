import { IS_BufferOperator } from "../operationQueue/IS_BufferOperator.js";
import { IS_BufferOperationWASMRequest } from "./IS_BufferOperationWASMRequest.js";

export const IS_BufferOperationWorkerBridge =
{
	requestOperation(operationRegistryData)
	{
		let operationWASMRequest = new IS_BufferOperationWASMRequest
		(
			operationRegistryData.operationRequests,
			operationRegistryData.bufferLength,
			operationRegistryData.bufferUUID
		);

		this._requestOperationWorker(operationWASMRequest);
	},

	_requestOperationWorker(operationWASMRequest)
	{
		BUFFER_WORKER_CONTEXT.postMessage
		(
			{ request: "operate", operationRequests: operationWASMRequest }
		);
	},

	ReturnCompletedOperation(completedOperationData)
	{
		IS_BufferOperator.CompleteOperation(completedOperationData);
	}
}

const BUFFER_WORKER_CONTEXT = initializeBufferWorkerContext();

function initializeBufferWorkerContext()
{
	let bufferWorkerContext = new Worker
	(
		new URL('./IS_BufferOperationWorkerContext.js', import.meta.url),
		{ type: 'module' }
	);

	bufferWorkerContext.addEventListener
	(
		"message", (message) => { bufferWorkerCallback(message); }
	);

	return bufferWorkerContext;
}

function bufferWorkerCallback(message)
{
	if(message.data.operationData)
	{
		let completedOperationData = message.data.operationData;
		IS_BufferOperationWorkerBridge.ReturnCompletedOperation(completedOperationData);
	}
}

