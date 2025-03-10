export const IS_BufferOperationManager =
{
	_operationQueue: [],
	_buffer: null,

	requestOperation(iSBuffer)
	{
		let buffer = iSBuffer;
		this._buffer = buffer;
		this._enqueueBufferOperation(buffer.operationRequestData);
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
		// console.log("Request Operation Worker for: ", iSBufferOperationData);
		BUFFER_WORKER_CONTEXT.postMessage
		(
			// TODO: this should be a data type
			{ request: "operate", operationData: iSBufferOperationData }
		);
	},

	ReturnBuffer(bufferArray)
	{
		this._buffer.buffer.copyToChannel(bufferArray, 0);
		console.log("IS_BufferOperationManager.ReturnBuffer: ");
		this._buffer.print();
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
		IS_BufferOperationManager.ReturnBuffer(buffer);
	}
}

