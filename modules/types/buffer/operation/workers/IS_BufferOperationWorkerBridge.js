import { IS_BufferOperationQueue } from "../operationQueue/IS_BufferOperationQueue.js";

export const IS_BufferOperationWorkerBridge =
{
	requestOperation(bufferOperationData)
	{
		this._requestOperationWorker(bufferOperationData);
	},

	_requestOperationWorker(iSBufferOperationData)
	{
		BUFFER_WORKER_CONTEXT.postMessage
		(
			{ request: "operate", operationData: iSBufferOperationData }
		);
	},

	ReturnCompletedOperation(completedOperationData)
	{
		IS_BufferOperationQueue.CompleteOperation(completedOperationData);
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

