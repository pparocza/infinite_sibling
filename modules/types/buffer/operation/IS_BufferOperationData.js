export class IS_BufferOperationData
{
	constructor(iSOperatorType, iSFunctionData, sampleRate)
	{
		this._operatorType = iSOperatorType;
		this._functionData = iSFunctionData;
		this._sampleRate = sampleRate;
	}

	get sampleRate() { return this._sampleRate; };
	set sampleRate(value) { this._sampleRate = value; };

	get operatorType() { return this._operatorType; };
	set operatorType(iSOperatorType) { this._operatorType = iSOperatorType; }
	get functionData() { return this._functionData; };
	set functionData(iSFunctionData) { this._functionData = iSFunctionData; }
}
