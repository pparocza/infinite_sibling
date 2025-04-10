export class IS_BufferOperationRequest
{
	constructor(operationData, bufferLength, bufferUUID)
	{
		this.operationData = operationData;
		this.bufferLength = bufferLength;
		this.bufferUUID = bufferUUID;
		this.completedOperationArray = new Float32Array(this.bufferLength);
	}
}