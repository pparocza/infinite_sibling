export class IS_BufferOperationRequestData
{
	constructor
	(
		iSOperatorType = null, iSFunctionData = null, bufferUuid = null
	)
	{
		this._operatorType = iSOperatorType;
		this._functionData = iSFunctionData;

		this._currentBufferArray = null;
		this._operationArray = null;
		this._isSuspendedOperation = false;

		this._bufferUuid = bufferUuid;

		this._channelNumber = 0;
	}

	get operatorType() { return this._operatorType; };
	set operatorType(iSOperatorType) { this._operatorType = iSOperatorType; };
	get functionData() { return this._functionData; };
	set functionData(iSFunctionData) { this._functionData = iSFunctionData; };

	get currentBufferArray() { return this._currentBufferArray; };
	set currentBufferArray(value)
	{
		this._currentBufferArray = value;
		this._operationArray = new Float32Array(this._currentBufferArray.length);
	}

	get isSuspendedOperation() { return this._isSuspendedOperation; }
	set isSuspendedOperation(value) { this._isSuspendedOperation = value; }

	get bufferUuid() { return this._bufferUuid; };
}
