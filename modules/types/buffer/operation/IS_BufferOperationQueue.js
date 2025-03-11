import { IS_BufferOperationManager } from "./IS_BufferOperationManager.js";

export class IS_BufferOperationQueue
{
	constructor(iSAudioBuffer)
	{
		this._buffer = iSAudioBuffer;
		this._bufferUuid = this._buffer.uuid;
		this._operationQueue = [];
		this._isOperating = false;

		this._waitingBuffers = [];
	}

	get bufferUuid() { return this._bufferUuid; };

	get isOperating() { return this._isOperating; };

	requestOperation(bufferOperationRequestData)
	{
		this._isOperating = true;
		this._enqueueBufferOperation(bufferOperationRequestData);
	}

	_enqueueBufferOperation(bufferOperationRequestData)
	{
		this._operationQueue.push(bufferOperationRequestData);

		if(this._operationQueue.length === 1)
		{
			this._nextOperation();
		}
	};

	_nextOperation()
	{
		IS_BufferOperationManager.requestOperation(this, this._operationQueue[0]);
	}

	updateBuffer(completedOperationData)
	{
		let bufferArray = completedOperationData._operationArray;
		this._buffer.buffer.copyToChannel(bufferArray, 0);
		this._buffer.print();

		this._handleOperationComplete();
	}

	_handleOperationComplete()
	{
		this._operationQueue.shift();

		if(this._operationQueue.length > 0)
		{
			this._nextOperation();
		}
		else
		{
			this._handleQueueComplete();
		}
	}

	_handleQueueComplete()
	{
		IS_BufferOperationManager.removeQueue(this);
		this._handleWaitingBuffers();
		this._buffer.operationQueueComplete();
		this._isOperating = false;
	}

	addToWaitList(isAudioBuffer)
	{
		this._waitingBuffers.push(isAudioBuffer);
	}

	_handleWaitingBuffers()
	{
		while(this._waitingBuffers.length > 0)
		{
			let waitingBuffer = this._waitingBuffers.shift();
			waitingBuffer.waitEnded(this._buffer);
		}
	}

}