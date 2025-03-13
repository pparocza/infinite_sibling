export class IS_BufferOperationQueueBufferRegistryData
{
	constructor(buffer)
	{
		this._buffer = buffer;
		this._operationRequestCount = 0;
		this._isDone = null;
	}

	get buffer() { return this._buffer; }
	get isDone() { return this._isDone; }

	completeOperation(completedOperationData)
	{
		this._buffer.completeOperation(completedOperationData);
		this.removeOperationRequest();
	}

	addOperationRequest()
	{
		this._operationRequestCount++;
		this._isDone = false;
	}

	removeOperationRequest()
	{
		this._operationRequestCount--;
		this._isDone = this._operationRequestCount === 0;

		if(this._isDone)
		{
			this._buffer.operationsComplete();
		}
	}
}