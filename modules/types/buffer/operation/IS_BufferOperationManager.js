export const IS_BufferOperationManager =
{
	_operationQueues: {},

	requestOperation(iSBufferOperationQueue, bufferOperationData)
	{
		this._registerQueue(iSBufferOperationQueue);
		this._requestOperationWorker(bufferOperationData);
	},

	_registerQueue(iSBufferOperationQueue)
	{
		let uuid = iSBufferOperationQueue.bufferUuid;

		if(!this._operationQueues[uuid])
		{
			this._operationQueues[uuid] = iSBufferOperationQueue;
		}
	},

	removeQueue(iSBufferOperationQueue)
	{
		let uuid = iSBufferOperationQueue.bufferUuid;

		if(this._operationQueues[uuid])
		{
			delete this._operationQueues[uuid];
		}
	},

	_requestOperationWorker(iSBufferOperationData)
	{
		// console.log("Request Operation Worker for: ", iSBufferOperationData);
		BUFFER_WORKER_CONTEXT.postMessage
		(
			// TODO: this should be a data type
			{ request: "operate", operationData: iSBufferOperationData }
		);
	},

	UpdateQueue(completedOperationData)
	{
		let bufferUuid = completedOperationData._bufferUuid;

		let operationQueue = this._operationQueues[bufferUuid];
		operationQueue.updateBuffer(completedOperationData);
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

