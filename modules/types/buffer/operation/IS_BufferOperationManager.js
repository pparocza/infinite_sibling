export const IS_BufferOperationManager =
{
	// TODO: IS_OperationQueue - IS_Buffer-specific instance to handle all operation requests
	_operationQueue: [],
	_buffers: {},

	requestOperation(iSAudioBuffer, bufferOperationData)
	{
		let uuid = bufferOperationData._bufferUuid;

		if(!this._buffers[uuid])
		{
			this._buffers[uuid] = iSAudioBuffer;
		}

		this._enqueueBufferOperation(bufferOperationData);
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
		this._requestOperationWorker(this._operationQueue[0]);
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

	_handleOperationComplete()
	{
		this._operationQueue.shift();

		if(this._operationQueue.length > 0)
		{
			this._nextOperation();
		}
	},

	// TODO: "Buffer Operations Complete" FLAG
	/*
		--> now that this is off the main thread, the "Start" button will likely be active before all the
		buffers are completed
	*/
	ReturnBuffer(completedOperationData)
	{
		let bufferArray = completedOperationData._operationArray;
		let bufferId = completedOperationData._bufferUuid;

		let bufferToUpdate = this._buffers[bufferId];
		bufferToUpdate.buffer.copyToChannel(bufferArray, 0);
		console.log("IS_BufferOperationManager.ReturnBuffer: ");
		bufferToUpdate.print();

		this._handleOperationComplete();
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
		IS_BufferOperationManager.ReturnBuffer(completedOperationData);
	}
}

