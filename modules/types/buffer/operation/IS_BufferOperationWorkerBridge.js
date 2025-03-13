import { IS_BufferOperationQueue } from "./IS_BufferOperationQueue.js";

export const IS_BufferOperationManager =
{
	requestOperation(bufferOperationData)
	{
		this._requestOperationWorker(bufferOperationData);
	},

	_requestOperationWorker(iSBufferOperationData)
	{
		BUFFER_WORKER_CONTEXT.postMessage
		(
			// TODO: iSBufferOperation should be a data type
			{ request: "operate", operationData: iSBufferOperationData }
		);
	},

	UpdateQueue(completedOperationData)
	{
		IS_BufferOperationQueue.completeOperation(completedOperationData);
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
		IS_BufferOperationManager.UpdateQueue(completedOperationData);
	}
}

