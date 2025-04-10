/**
 * Ties an IS_Buffer to requested operations in IS_BufferOperationRegistry
 */
export class IS_BufferOperationRegistryData
{
	constructor(buffer)
	{
		this._buffer = buffer;
		this._operationRequests = [];
	}

	get buffer() { return this._buffer; }
	get bufferLength () { return this._buffer.length; }
	get bufferUUID() { return this._buffer.uuid; }
	get operationRequests() { return this._operationRequests; }

	completeOperation(completedOperationData)
	{
		this._buffer.completeOperation(completedOperationData);
	}

	addOperationData(bufferOperationData)
	{
		this._operationRequests.push(bufferOperationData);
	}
}