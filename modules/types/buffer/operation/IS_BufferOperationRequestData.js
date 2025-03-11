export class IS_BufferOperationRequestData
{
	constructor
	(
		iSOperatorType = null, iSFunctionData = null,
		bufferArray = null, bufferUuid = null
	)
	{
		this._operatorType = iSOperatorType;
		this._functionData = iSFunctionData;

		this._currentBufferArray = bufferArray;
		this._operationArray = bufferArray !== null ? new Float32Array(bufferArray.length) : null;

		this._bufferUuid = bufferUuid;
	}

	get currentBufferArray() { return this._currentBufferArray; };
	set currentBufferArray(value) { this._currentBufferArray = value; }

	get operatorType() { return this._operatorType; };
	set operatorType(iSOperatorType) { this._operatorType = iSOperatorType; };
	get functionData() { return this._functionData; };
	set functionData(iSFunctionData) { this._functionData = iSFunctionData; };
}
