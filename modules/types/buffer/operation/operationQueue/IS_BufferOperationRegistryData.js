export class IS_BufferOperationRegistryData
{
	constructor(buffer)
	{
		// TODO: at some point this can probably be a uuid instead of the buffer
		this._buffer = buffer;
		this._operationRequestCount = 0;
		this._operationData = [];
		this._isDone = null;
	}

	get buffer() { return this._buffer; }
	get isDone() { return this._isDone; }

	get operationData() { return this._operationData; }

	completeOperation(completedOperationData)
	{
		this._buffer.completeOperation(completedOperationData);
	}

	addOperationData(bufferOperationData)
	{
		this._operationRequestCount++;
		this._operationData.push(bufferOperationData);
		this._isDone = false;
	}
}