export class IS_BufferOperationData
{
	constructor(iSOperatorType, iSFunctionData, bufferLength)
	{
		this._operatorType = iSOperatorType;
		this._functionData = iSFunctionData;
		this._bufferLength = bufferLength;
	}

	get bufferLength() { return this._bufferLength; };
	set bufferLength(value) { this._bufferLength = value; };

	get operatorType() { return this._operatorType; };
	set operatorType(iSOperatorType) { this._operatorType = iSOperatorType; }
	get functionData() { return this._functionData; };
	set functionData(iSFunctionData) { this._functionData = iSFunctionData; }
}
