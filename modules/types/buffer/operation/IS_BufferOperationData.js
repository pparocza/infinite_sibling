/*
	NOTE!!!: Since this is used to pass data to and from Workers, it should not
	have getters and setters, since they will not be cloned into the Worker context
*/
export class IS_BufferOperationData
{
	constructor(iSOperatorType = null, iSFunctionData = null, bufferUuid = null)
	{
		this.functionData = iSFunctionData;
		this.operatorType = iSOperatorType;

		this.isSuspendedOperation = false;

		this.bufferUuid = bufferUuid;

		this.channelNumber = 0;
	}
}
