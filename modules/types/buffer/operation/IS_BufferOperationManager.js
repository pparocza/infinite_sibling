export const IS_BufferOperationManager =
{
	_operationQueue: [],

	requestOperation(isBufferOperationData)
	{
		this._enqueueBufferOperation(isBufferOperationData);
	},

	_enqueueBufferOperation(iSBufferOperationData)
	{
		this._operationQueue.push(iSBufferOperationData);

		if(this._operationQueue.length === 1)
		{
			this._nextOperation();
		}
	},

	_nextOperation()
	{
		this._requestOperationWorker(this._operationQueue.shift());
	},

	_requestOperationWorker(iSBufferOperationData)
	{
		console.log("Request Operation Worker for: ", iSBufferOperationData);
		BUFFER_WORKER_CONTEXT.postMessage
		(
			// TODO: this should be a data type
			{ request: "operate", operationData: iSBufferOperationData }
		);
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
	if(message.data.buffer)
	{
		// TODO: returning the buffer to IS_Buffer
		let buffer = message.data.buffer;
		console.log("Operation Manager got the buffer: ", message.data);
	}
}

