export class IS_BufferOperationRequestData
{
	constructor
	(
		iSOperatorType = null, iSFunctionData = null,
		bufferLength = null, bufferArray = null, bufferUuid = null
	)
	{
		this._operatorType = iSOperatorType;
		this._functionData = iSFunctionData;

		this._currentBufferArray = bufferArray;
		this._operationArray = bufferArray !== null ? new Float32Array(bufferArray.length) : null;

		this._bufferLength = bufferLength;
		this._bufferUuid = bufferUuid;
	}

	get bufferLength() { return this._bufferLength; };
	set bufferLength(value) { this._bufferLength = value; };

	get currentBufferArray() { return this._currentBufferArray; };
	set currentBufferArray(value) { this._currentBufferArray = value; }

	get operatorType() { return this._operatorType; };
	set operatorType(iSOperatorType) { this._operatorType = iSOperatorType; };
	get functionData() { return this._functionData; };
	set functionData(iSFunctionData) { this._functionData = iSFunctionData; };
}
